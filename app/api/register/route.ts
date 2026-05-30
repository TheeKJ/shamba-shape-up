import { NextRequest, NextResponse } from 'next/server';

import { sendWelcomeEmail } from '@/lib/email';

const USER_ROLES = ['investor', 'farmer', 'worker', 'admin'] as const;

type UserRole = (typeof USER_ROLES)[number];

type RegisterPayload = {
  fullName?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  phone?: string;
  county?: string;
};

function isUserRole(value: unknown): value is UserRole {
  return typeof value === 'string' && USER_ROLES.includes(value as UserRole);
}

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
    const payload = (await req.json()) as RegisterPayload;

    const fullName = cleanText(payload.fullName);
    const email = cleanText(payload.email).toLowerCase();
    const password = cleanText(payload.password);
    const phone = cleanText(payload.phone);
    const county = cleanText(payload.county);
    const role = payload.role;

    if (!fullName || !email || !password || !isUserRole(role)) {
      return NextResponse.json(
        { error: 'Full name, email, password, and account role are required.' },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters.' },
        { status: 400 },
      );
    }

    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey =
      process.env.SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !anonKey) {
      return NextResponse.json(
        { error: 'Supabase URL and anon key are not configured on the server.' },
        { status: 500 },
      );
    }

    const authResponse = await fetch(`${supabaseUrl}/auth/v1/signup`, {
      method: 'POST',
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        data: {
          full_name: fullName,
          role,
          phone: phone || null,
          county: county || null,
        },
      }),
    });

    const authData = await readSupabaseJson(authResponse);

    if (!authResponse.ok) {
      return NextResponse.json(
        { error: authData?.msg || authData?.message || authData?.error_description || 'Supabase auth registration failed.' },
        { status: authResponse.status },
      );
    }

    const authUser = authData?.user || authData;
    const authUserId = authUser?.id;

    if (!authUserId) {
      return NextResponse.json(
        {
          error: 'Supabase auth did not return a user id.',
          supabaseResponseKeys: authData && typeof authData === 'object' ? Object.keys(authData) : [],
        },
        { status: 502 },
      );
    }

    const storageKey = serviceRoleKey || anonKey;
    const profileResponse = await fetch(`${supabaseUrl}/rest/v1/users`, {
      method: 'POST',
      headers: {
        apikey: storageKey,
        Authorization: `Bearer ${storageKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify({
        id: authUserId,
        email,
        full_name: fullName,
        role,
        phone: phone || null,
        county: county || null,
      }),
    });

    const profileData = await readSupabaseJson(profileResponse);

    if (!profileResponse.ok) {
      return NextResponse.json(
        {
          error: profileData?.message || 'Auth user was created, but profile storage failed.',
          authUserId,
        },
        { status: profileResponse.status },
      );
    }

    const emailDelivery = await sendWelcomeEmail({
      to: email,
      fullName,
      role,
      county: county || null,
      requiresEmailConfirmation: !authData?.session,
    });

    const response = NextResponse.json(
      {
        user: profileData?.[0] || profileData,
        session: authData?.session || null,
        requiresEmailConfirmation: !authData?.session,
        emailDelivery,
      },
      { status: 201 },
    );

    if (authData?.session?.access_token) {
      response.cookies.set('shamba_access_token', authData.session.access_token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: authData.session.expires_in || 3600,
      });

      response.cookies.set('shamba_user_role', role, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: authData.session.expires_in || 3600,
      });
    }

    return response;
  } catch (error) {
    console.error('Registration route failed:', error);
    return NextResponse.json(
      { error: 'Unable to complete registration.' },
      { status: 500 },
    );
  }
}
