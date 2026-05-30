import { jsx } from 'react/jsx-runtime';
import { Resend } from 'resend';

import { WelcomeEmail } from '@/emails/welcome-email';

const roleLabels: Record<string, string> = {
  investor: 'Investor Hub',
  farmer: 'Farmer Terminal',
  worker: 'Field Agent',
  admin: 'Compliance Desk',
};

type SendWelcomeEmailInput = {
  to: string;
  fullName: string;
  role: string;
  county?: string | null;
  requiresEmailConfirmation?: boolean;
};

type EmailDeliveryResult =
  | { status: 'sent'; id: string }
  | { status: 'skipped'; reason: string }
  | { status: 'failed'; reason: string };

export async function sendWelcomeEmail({
  to,
  fullName,
  role,
  county,
  requiresEmailConfirmation = false,
}: SendWelcomeEmailInput): Promise<EmailDeliveryResult> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return {
      status: 'skipped',
      reason: 'RESEND_API_KEY is not configured.',
    };
  }

  const resend = new Resend(apiKey);
  const roleLabel = roleLabels[role] || 'SHAMBA Workspace';
  const from = process.env.RESEND_FROM_EMAIL || 'SHAMBA <onboarding@resend.dev>';
  const replyTo = process.env.RESEND_REPLY_TO_EMAIL;

  const { data, error } = await resend.emails.send({
    from,
    to,
    replyTo,
    subject: `Welcome to SHAMBA ${roleLabel}`,
    react: jsx(WelcomeEmail, {
      fullName,
      roleLabel,
      county,
      requiresEmailConfirmation,
    }),
    tags: [
      {
        name: 'type',
        value: 'welcome',
      },
      {
        name: 'role',
        value: role,
      },
    ],
  });

  if (error) {
    return {
      status: 'failed',
      reason: error.message,
    };
  }

  return {
    status: 'sent',
    id: data?.id || '',
  };
}
