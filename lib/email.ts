import { jsx } from 'react/jsx-runtime';

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
  const provider = process.env.EMAIL_PROVIDER;

  if (!provider) {
    return {
      status: 'skipped',
      reason: 'No email provider is configured.',
    };
  }

  const roleLabel = roleLabels[role] || 'SHAMBA Workspace';
  const from = process.env.EMAIL_FROM_EMAIL || 'SHAMBA <no-reply@shamba.example>';
  const replyTo = process.env.EMAIL_REPLY_TO_EMAIL;
  const subject = `Welcome to SHAMBA ${roleLabel}`;
  const { renderToStaticMarkup } = await import('react-dom/server');
  const html = renderToStaticMarkup(
    jsx(WelcomeEmail, {
      fullName,
      roleLabel,
      county,
      requiresEmailConfirmation,
    }),
  );

  if (provider === 'console' || provider === 'log') {
    console.info('Email payload', {
      to,
      from,
      replyTo,
      subject,
      html,
    });

    return {
      status: 'skipped',
      reason: 'Email delivery was logged rather than sent.',
    };
  }

  return {
    status: 'failed',
    reason: `Email provider '${provider}' is not implemented.`,
  };
}
