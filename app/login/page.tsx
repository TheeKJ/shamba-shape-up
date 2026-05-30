'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import toast from 'react-hot-toast';
import {
  ArrowRight,
  CheckCircle,
  Eye,
  EyeOff,
  Lock,
  Shield,
  Sprout,
  UserCheck,
  Users,
  Wallet,
} from 'lucide-react';

const workspaceLabels: Record<string, string> = {
  investor: 'Investor Hub',
  farmer: 'Farmer Terminal',
  worker: 'Field Agent',
  admin: 'Compliance Desk',
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = React.useState('');
  const [workspace, setWorkspace] = React.useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('loading');
    setMessage('');
    setWorkspace('');
    const toastId = toast.loading('Checking your Supabase credentials...');

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed.');
      }

      const role = data.profile?.role || data.user?.user_metadata?.role || 'investor';
      const workspaceLabel = workspaceLabels[role] || workspaceLabels.investor;
      setWorkspace(workspaceLabel);
      setStatus('success');
      setMessage('Login successful. Your Supabase session was issued and profile loaded.');
      toast.success(`Welcome back. Opening ${workspaceLabel}.`, { id: toastId });
      setPassword('');
      router.push(`/${role}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed.';
      setStatus('error');
      setMessage(errorMessage);
      toast.error(errorMessage, { id: toastId });
    }
  }

  return (
    <main className="min-h-screen bg-[#FDFCFB] text-[#1B3022]">
      <header className="border-b border-[#1B3022]/10 bg-[#FDFCFB]/95 px-5 py-4 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center border border-[#1B3022]/15 bg-[#1B3022] text-[#FDFCFB]">
              <Sprout className="h-5 w-5 text-emerald-300" />
            </div>
            <div>
              <span className="font-serif text-3xl font-black uppercase leading-none tracking-tighter text-[#1B3022]">
                SHAMBA
              </span>
              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-[#D97757]">
                Secure sign in
              </p>
            </div>
          </Link>

          <Link
            href="/register"
            className="hidden border border-[#1B3022]/15 px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-widest text-[#1B3022]/70 transition hover:border-[#D97757] hover:text-[#D97757] sm:inline-flex"
          >
            Create account
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-5 py-8 lg:grid-cols-[0.9fr_1.1fr] lg:py-14">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1B3022] p-7 text-[#FDFCFB] shadow-xl"
          >
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-[#D97757]">
              Authenticated access
            </p>
            <h1 className="mt-3 max-w-xl font-serif text-4xl font-black leading-tight tracking-tight sm:text-5xl">
              Enter the escrow operating console.
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-6 text-[#FDFCFB]/75">
              Sign in with the Supabase identity created from registration and resume the workspace tied to your role.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-3">
              {[
                [Users, 'Investor Hub'],
                [Sprout, 'Farmer Terminal'],
                [UserCheck, 'Field Agent'],
                [Shield, 'Compliance Desk'],
              ].map(([Icon, label]) => {
                const RoleIcon = Icon as React.ComponentType<{ className?: string }>;

                return (
                  <div key={label as string} className="border border-[#FDFCFB]/10 bg-[#FDFCFB]/5 p-4">
                    <RoleIcon className="h-5 w-5 text-[#D97757]" />
                    <p className="mt-3 font-mono text-[9px] font-bold uppercase tracking-widest text-[#FDFCFB]/65">
                      {label as string}
                    </p>
                  </div>
                );
              })}
            </div>
          </motion.div>

          <div className="border border-[#1B3022]/10 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 border-b border-[#1B3022]/10 pb-3">
              <Lock className="h-4 w-4 text-[#D97757]" />
              <h2 className="font-serif text-base font-black text-[#1B3022]">Session handoff</h2>
            </div>
            <div className="mt-4 space-y-3 text-xs leading-5 text-[#1B3022]/65">
              <p>Supabase validates the email and password through Auth.</p>
              <p>The API then reads the matching profile from `public.users` under RLS.</p>
              <p>The returned role can route the user into the correct workspace.</p>
            </div>
          </div>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          onSubmit={handleSubmit}
          className="self-start border border-[#1B3022]/10 bg-white p-5 shadow-sm sm:p-7"
        >
          <div className="flex flex-col gap-2 border-b border-[#1B3022]/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-[#D97757]">
                Supabase auth
              </p>
              <h2 className="mt-1 font-serif text-2xl font-black tracking-tight text-[#1B3022]">
                Login
              </h2>
            </div>
            <div className="inline-flex items-center gap-2 bg-[#F5F2EF] px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-widest text-[#1B3022]/60">
              <Wallet className="h-3.5 w-3.5 text-[#D97757]" />
              Protected session
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <Field label="Email address">
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                placeholder="name@shamba.africa"
                className="w-full border border-[#1B3022]/15 bg-[#FDFCFB] px-3 py-2.5 text-sm font-semibold text-[#1B3022] outline-none transition placeholder:text-[#1B3022]/30 focus:border-[#D97757]"
              />
            </Field>

            <Field label="Password">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  minLength={8}
                  className="w-full border border-[#1B3022]/15 bg-[#FDFCFB] px-3 py-2.5 pr-11 text-sm font-semibold text-[#1B3022] outline-none transition focus:border-[#D97757]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-[#1B3022]/50 transition hover:text-[#D97757]"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </Field>
          </div>

          {message && (
            <div
              className={`mt-5 border px-4 py-3 text-xs font-semibold leading-5 ${
                status === 'success'
                  ? 'border-emerald-700/15 bg-emerald-50 text-emerald-900'
                  : 'border-red-700/15 bg-red-50 text-red-900'
              }`}
              aria-live="polite"
            >
              <div className="flex items-start gap-2">
                {status === 'success' && <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" />}
                <div>
                  <p>{message}</p>
                  {workspace && (
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-widest">
                      Workspace: {workspace}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-col gap-3 border-t border-[#1B3022]/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-sm text-[11px] leading-5 text-[#1B3022]/55">
              No account yet?{' '}
              <Link href="/register" className="font-bold text-[#D97757] hover:text-[#1B3022]">
                Register a role profile
              </Link>
              .
            </p>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="inline-flex h-11 items-center justify-center gap-2 bg-[#1B3022] px-5 font-mono text-[10px] font-bold uppercase tracking-widest text-white shadow-sm transition hover:bg-[#243d2c] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === 'loading' ? 'Signing in...' : 'Sign in'}
              <ArrowRight className="h-4 w-4 text-[#D97757]" />
            </button>
          </div>
        </motion.form>
      </section>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-[9px] font-bold uppercase tracking-widest text-[#D97757]">
        {label}
      </span>
      {children}
    </label>
  );
}
