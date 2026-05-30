import { GoogleGenAI } from '@google/genai';
import type { Farm } from '@/types';
import { NextRequest, NextResponse } from 'next/server';

type SearchResult = {
  farmIds: string[];
  summary: string;
  isSimulated?: boolean;
};

export async function POST(req: NextRequest) {
  try {
    const { query, farms } = (await req.json()) as {
      query?: string;
      farms?: Farm[];
    };

    const searchQuery = typeof query === 'string' ? query.trim() : '';
    const availableFarms = Array.isArray(farms) ? farms : [];

    if (!searchQuery) {
      return NextResponse.json({ farmIds: [], summary: 'No search query supplied.' });
    }

    if (availableFarms.length === 0) {
      return NextResponse.json({ farmIds: [], summary: 'No farm listings are available to search.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      return NextResponse.json(generateLocalSearch(searchQuery, availableFarms));
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const systemPrompt = `You are SHAMBA's agricultural marketplace search engine.
Return only JSON. Do not wrap the response in markdown.
Rank farm listings by semantic relevance to the user's query. Match concepts such as crop, location, farmer name, livestock, aquaculture, risk level, ROI, verification status, and funding status.

Return this shape:
{
  "farmIds": ["farm-1"],
  "summary": "One short sentence explaining the search result set."
}`;

    const userPrompt = `Search query: ${searchQuery}

Available farm listings:
${JSON.stringify(
  availableFarms.map((farm) => ({
    id: farm.id,
    name: farm.name,
    farmerName: farm.farmerName,
    location: farm.location,
    country: farm.country,
    type: farm.type,
    cropType: farm.cropType,
    riskLevel: farm.riskLevel,
    expectedROI: farm.expectedROI,
    status: farm.status,
    verificationStatus: farm.verificationStatus,
    description: farm.description,
    yieldHistory: farm.yieldHistory,
  })),
  null,
  2,
)}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        temperature: 0.1,
      },
    });

    const replyText = response.text?.trim() || '{}';
    const cleanedText = replyText.replace(/^```json/i, '').replace(/```$/, '').trim();
    const result = JSON.parse(cleanedText) as Partial<SearchResult>;
    const validIds = new Set(availableFarms.map((farm) => farm.id));
    const farmIds = Array.isArray(result.farmIds)
      ? result.farmIds.filter((id) => typeof id === 'string' && validIds.has(id))
      : [];

    return NextResponse.json({
      farmIds,
      summary: typeof result.summary === 'string' ? result.summary : `Found ${farmIds.length} matching ventures.`,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Error in gemini search route:', err);
    return NextResponse.json({ error: 'Failed to complete search: ' + message }, { status: 500 });
  }
}

function generateLocalSearch(query: string, farms: Farm[]): SearchResult {
  const normalizedQuery = query.toLowerCase();
  const queryTerms = normalizedQuery.split(/\s+/).filter(Boolean);

  const scored = farms
    .map((farm) => {
      const searchableText = [
        farm.name,
        farm.farmerName,
        farm.location,
        farm.country,
        farm.type,
        farm.cropType,
        farm.riskLevel,
        farm.status,
        farm.verificationStatus,
        farm.description,
        farm.yieldHistory,
      ]
        .join(' ')
        .toLowerCase();

      const score = queryTerms.reduce((total, term) => {
        if (searchableText.includes(term)) {
          return total + 1;
        }

        return total;
      }, 0);

      return { farmId: farm.id, score };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score);

  return {
    farmIds: scored.map((result) => result.farmId),
    summary: `Found ${scored.length} listings matching "${query}".`,
    isSimulated: true,
  };
}
