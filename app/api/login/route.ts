import { NextRequest, NextResponse } from 'next/server';

type UserRole = 'investor' | 'farmer' | 'worker' | 'admin';

type LoginPayload = {
  email?: string;
  password?: string;
};

function cleanText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function createSimulatedId(prefix: string) {
  const random = Math.random().toString(36).slice(2, 10);
  return `${prefix}-${Date.now()}-${random}`;
}

function inferRoleFromEmail(email: string): UserRole {
  const localPart = email.split('@')[0] || '';

  if (localPart.includes('admin')) {
    return 'admin';
  }

  if (localPart.includes('worker') || localPart.includes('agent')) {
    return 'worker';
  }

  if (localPart.includes('farmer')) {
    return 'farmer';
  }

  return 'investor';
}

function setSimulatedAuthCookies(response: NextResponse, role: UserRole, accessToken: string) {
  response.cookies.set('shamba_access_token', accessToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 8,
  });

  response.cookies.set('shamba_user_role', role, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 8,
  });
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

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters in simulation mode.' },
        { status: 400 },
      );
    }

    const role = inferRoleFromEmail(email);
    const userId = createSimulatedId('sim-user');
    const accessToken = createSimulatedId('sim-token');
    const fullName = email
      .split('@')[0]
      .split(/[._-]/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ') || 'Farm LinkUser';

    const profile = {
      id: userId,
      email,
      full_name: fullName,
      role,
      phone: null,
      county: null,
      avatar_url: null,
      is_active: true,
      is_simulated: true,
    };

    const response = NextResponse.json({
      user: {
        id: userId,
        email,
        user_metadata: {
          full_name: fullName,
          role,
        },
        is_simulated: true,
      },
      profile,
      session: {
        accessToken,
        refreshToken: createSimulatedId('sim-refresh'),
        expiresIn: 60 * 60 * 8,
        tokenType: 'bearer',
      },
      isSimulated: true,
    });

    setSimulatedAuthCookies(response, role, accessToken);

    return response;
  } catch (error) {
    console.error('Simulated login route failed:', error);
    return NextResponse.json(
      { error: 'Unable to complete simulated login.' },
      { status: 500 },
    );
  }
}
