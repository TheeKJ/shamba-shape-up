import { NextRequest, NextResponse } from 'next/server';

type LoginPayload = {
  email?: string;
  password?: string;
};

function cleanText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

async function readSupabaseJson(response: Response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = (await req.json()) as LoginPayload;
    const email = cleanText(payload.email).toLowerCase();
    const password = cleanText(payload.password);

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 },
      );
    }

    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey =
      process.env.SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !anonKey) {
      return NextResponse.json(
        { error: 'Supabase URL and anon key are not configured on the server.' },
        { status: 500 },
      );
    }

    const authResponse = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const authData = await readSupabaseJson(authResponse);

    if (!authResponse.ok) {
      return NextResponse.json(
        { error: authData?.msg || authData?.message || authData?.error_description || 'Invalid login credentials.' },
        { status: authResponse.status },
      );
    }

    const accessToken = authData?.access_token;
    const userId = authData?.user?.id;
    let profile = null;

    if (accessToken && userId) {
      const profileResponse = await fetch(
        `${supabaseUrl}/rest/v1/users?id=eq.${encodeURIComponent(userId)}&select=*`,
        {
          method: 'GET',
          headers: {
            apikey: anonKey,
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const profileData = await readSupabaseJson(profileResponse);

      if (profileResponse.ok) {
        profile = profileData?.[0] || null;
      }
    }

    const role = profile?.role || authData?.user?.user_metadata?.role || 'investor';
    const response = NextResponse.json({
      user: authData?.user,
      profile,
      session: {
        accessToken: authData?.access_token,
        refreshToken: authData?.refresh_token,
        expiresIn: authData?.expires_in,
        tokenType: authData?.token_type,
      },
    });

    response.cookies.set('shamba_access_token', authData?.access_token || '', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: authData?.expires_in || 3600,
    });

    response.cookies.set('shamba_user_role', role, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: authData?.expires_in || 3600,
    });

    return response;
  } catch (error) {
    console.error('Login route failed:', error);
    return NextResponse.json(
      { error: 'Unable to complete login.' },
      { status: 500 },
    );
  }
}
