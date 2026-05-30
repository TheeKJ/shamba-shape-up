import { NextRequest, NextResponse } from 'next/server';

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

function createSimulatedId(prefix: string) {
  const random = Math.random().toString(36).slice(2, 10);
  return `${prefix}-${Date.now()}-${random}`;
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

    const userId = createSimulatedId('sim-user');
    const accessToken = createSimulatedId('sim-token');
    const profile = {
      id: userId,
      email,
      full_name: fullName,
      role,
      phone: phone || null,
      county: county || null,
      avatar_url: null,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_simulated: true,
    };

    const response = NextResponse.json(
      {
        user: {
          id: userId,
          email,
          user_metadata: {
            full_name: fullName,
            role,
            phone: phone || null,
            county: county || null,
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
        requiresEmailConfirmation: false,
        emailDelivery: {
          status: 'skipped',
          reason: 'Auth simulation mode does not send registration emails.',
        },
        isSimulated: true,
      },
      { status: 201 },
    );

    setSimulatedAuthCookies(response, role, accessToken);

    return response;
  } catch (error) {
    console.error('Simulated registration route failed:', error);
    return NextResponse.json(
      { error: 'Unable to complete simulated registration.' },
      { status: 500 },
    );
  }
}
