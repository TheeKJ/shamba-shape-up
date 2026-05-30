import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

type WelcomeEmailProps = {
  fullName: string;
  roleLabel: string;
  county?: string | null;
  requiresEmailConfirmation?: boolean;
};

export function WelcomeEmail({
  fullName,
  roleLabel,
  county,
  requiresEmailConfirmation = false,
}: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your SHAMBA {roleLabel} profile is ready.</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.brandBand}>
            <Text style={styles.brand}>SHAMBA</Text>
            <Text style={styles.eyebrow}>Agricultural Trust Infrastructure</Text>
          </Section>

          <Section style={styles.content}>
            <Text style={styles.kicker}>Account registry</Text>
            <Heading style={styles.heading}>Welcome, {fullName}.</Heading>
            <Text style={styles.paragraph}>
              Your SHAMBA profile has been created for the {roleLabel} workspace.
              {county ? ` We have recorded your primary operating county as ${county}.` : ''}
            </Text>

            <Section style={styles.summaryBox}>
              <Text style={styles.summaryLabel}>Workspace</Text>
              <Text style={styles.summaryValue}>{roleLabel}</Text>
              <Hr style={styles.hr} />
              <Text style={styles.summaryLabel}>Trust model</Text>
              <Text style={styles.summaryValue}>Escrow-first agricultural verification</Text>
            </Section>

            <Text style={styles.paragraph}>
              {requiresEmailConfirmation
                ? 'If Supabase email confirmation is enabled, please complete the confirmation step before signing in.'
                : 'You can now sign in and continue to the workspace assigned to your account.'}
            </Text>

            <Text style={styles.note}>
              SHAMBA connects verified farm projects, field audit telemetry, pooled Chama capital, and settlement controls in one operating layer.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const styles = {
  body: {
    backgroundColor: '#F5F2EF',
    color: '#1B3022',
    fontFamily: 'Arial, Helvetica, sans-serif',
    margin: '0',
    padding: '28px 12px',
  },
  container: {
    backgroundColor: '#FDFCFB',
    border: '1px solid rgba(27, 48, 34, 0.14)',
    margin: '0 auto',
    maxWidth: '580px',
  },
  brandBand: {
    backgroundColor: '#1B3022',
    padding: '24px 28px',
  },
  brand: {
    color: '#FDFCFB',
    fontFamily: 'Georgia, serif',
    fontSize: '34px',
    fontWeight: '900',
    letterSpacing: '0',
    lineHeight: '1',
    margin: '0',
  },
  eyebrow: {
    color: '#D97757',
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '2px',
    lineHeight: '1.4',
    margin: '8px 0 0',
    textTransform: 'uppercase' as const,
  },
  content: {
    padding: '28px',
  },
  kicker: {
    color: '#D97757',
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '2px',
    margin: '0 0 8px',
    textTransform: 'uppercase' as const,
  },
  heading: {
    color: '#1B3022',
    fontFamily: 'Georgia, serif',
    fontSize: '30px',
    fontWeight: '900',
    letterSpacing: '0',
    lineHeight: '1.18',
    margin: '0 0 16px',
  },
  paragraph: {
    color: 'rgba(27, 48, 34, 0.78)',
    fontSize: '14px',
    lineHeight: '1.65',
    margin: '0 0 18px',
  },
  summaryBox: {
    backgroundColor: '#F5F2EF',
    border: '1px solid rgba(27, 48, 34, 0.12)',
    margin: '22px 0',
    padding: '18px',
  },
  summaryLabel: {
    color: 'rgba(27, 48, 34, 0.48)',
    fontSize: '10px',
    fontWeight: '700',
    letterSpacing: '1.7px',
    margin: '0 0 4px',
    textTransform: 'uppercase' as const,
  },
  summaryValue: {
    color: '#1B3022',
    fontSize: '15px',
    fontWeight: '800',
    lineHeight: '1.4',
    margin: '0',
  },
  hr: {
    borderColor: 'rgba(27, 48, 34, 0.12)',
    margin: '16px 0',
  },
  note: {
    borderTop: '1px solid rgba(27, 48, 34, 0.1)',
    color: 'rgba(27, 48, 34, 0.54)',
    fontSize: '12px',
    lineHeight: '1.6',
    margin: '24px 0 0',
    paddingTop: '16px',
  },
};
