import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { farm, updates, reports } = await req.json();

    if (!farm) {
      return NextResponse.json({ error: 'Farm context is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      // High-integrity offline simulation for admin portal demo purposes
      return NextResponse.json(generateLocalFallbackAnomaly(farm, updates));
    }

    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const systemPrompt = `You are the lead Fraud Analyser and Risk Assessor for Farm Link's administrative security layer.
You evaluate updates, field agent inspection inputs, and crop timelines to identify any suspicious user behaviors, discrepancies in yields, visual reports, or update omissions.
Explain if the update pace matches natural cultivation cycles (e.g., a tomato cannot go from transplanting to harvesting in 4 days).
Return your response strictly as a JSON object. Do not prepend markdown formatting backticks like \`\`\`json. Return only the JSON object itself.

Return format must follow this schema:
{
  "anomalyDetected": false, // boolean
  "riskScore": 12, // 0 to 100
  "findings": [
    "A concise point outlining timeline, reporting gaps, or matching results"
  ],
  "riskExplanation": "A professional paragraph detailing the physical and financial risk of the project's reporting health.",
  "recommendedAction": "schedule_inspection" // choices: 'none' | 'suspend' | 'schedule_inspection' | 'flag_updates'
}`;

    const userPrompt = `Farm Identity: ${farm.name} (Acres: ${farm.sizeAcres}, Type: ${farm.type}, Crop: ${farm.cropType})
Farmer credit score: ${farm.farmerCreditScore}
Verification status on system: ${farm.verificationStatus}

Latest Logged Updates:
${JSON.stringify(updates, null, 2)}

Field Inspection Reports:
${JSON.stringify(reports, null, 2)}`;

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
    const resultObj = JSON.parse(cleanedText);

    return NextResponse.json(resultObj);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Error in gemini anomaly route:', err);
    return NextResponse.json({ error: 'Failed to complete anomaly computation: ' + message }, { status: 500 });
  }
}

function generateLocalFallbackAnomaly(
  farm: { verificationStatus: string; name: string; farmerCreditScore: number },
  updates: unknown[],
) {
  const isPending = farm.verificationStatus === 'pending';
  const hasNoUpdates = !updates || updates.length === 0;
  
  let anomalyDetected = false;
  let riskScore = 15;
  const findings: string[] = [];
  let action: 'none' | 'suspend' | 'schedule_inspection' | 'flag_updates' = 'none';
  let explanation = '';

  if (isPending) {
    anomalyDetected = true;
    riskScore = 55;
    findings.push('The listing has been created but does not possess an endorsed active field inspection report.');
    findings.push('Gaps exist in geo-fencing validations. Physical boundaries are not yet lock-pinned.');
    action = 'schedule_inspection';
    explanation = `Project '${farm.name}' requires physical verification. While the farmer has registered credentials, we require an independent field agent to visit, record soil conditions, check coordinate files, and upload geo-tagged image audits.`;
  } else if (hasNoUpdates) {
    anomalyDetected = true;
    riskScore = 40;
    findings.push('Zero reports submitted in the past 14 days.');
    findings.push('No receipt uploads for early planting equipment and preparations.');
    action = 'flag_updates';
    explanation = `The cultivation timeline is underway, but zero progress updates have been logged. We recommend requesting the farmer to provide image verification of seed stocks or early sprouting.`;
  } else {
    // Standard healthy checks
    riskScore = Math.max(8, 100 - farm.farmerCreditScore);
    findings.push('Timeline sequences correspond correctly to modern crop maturity tables.');
    findings.push('Coordinates logged for updates align with the title boundaries.');
    findings.push('Field agent Beatrice Akoth verified health logs with negative pest counts.');
    explanation = 'This venture demonstrates normal agronomic progress. The reporting frequency is active and aligns with recommended standards. Financial records conform to seasonal budgets.';
    action = 'none';
  }

  return {
    anomalyDetected,
    riskScore,
    findings,
    riskExplanation: explanation,
    recommendedAction: action,
    isSimulated: true
  };
}
