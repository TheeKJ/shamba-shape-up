"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import toast from "react-hot-toast";
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
} from "lucide-react";

type Role = "investor" | "farmer" | "worker" | "admin";

const roleOptions: Array<{
  id: Role;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  {
    id: "investor",
    label: "Investor Hub",
    description:
      "Acquire verified farm units and join pooled Chama allocations.",
    icon: Users,
  },
  {
    id: "farmer",
    label: "Farmer Terminal",
    description:
      "Register projects, submit crop updates, and receive escrow releases.",
    icon: Sprout,
  },
  {
    id: "worker",
    label: "Field Agent",
    description:
      "Complete physical verification reports and geo-tagged inspections.",
    icon: UserCheck,
  },
  {
    id: "admin",
    label: "Compliance Desk",
    description:
      "Review listings, monitor telemetry, and authorize settlement flows.",
    icon: Shield,
  },
];

const counties = [
  "Nairobi County",
  "Nakuru County",
  "Kisumu County",
  "Muranga County",
  "Kilifi County",
  "Laikipia County",
  "Mombasa County",
  "Kiambu County",
];

export default function RegisterPage() {
  const [role, setRole] = React.useState<Role>("investor");
  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [county, setCounty] = React.useState("Nairobi County");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [status, setStatus] = React.useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = React.useState("");

  const selectedRole =
    roleOptions.find((option) => option.id === role) || roleOptions[0];

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (password !== confirmPassword) {
      setStatus("error");
      setMessage("Passwords do not match.");
      toast.error("Passwords do not match.");
      return;
    }

    setStatus("loading");
    const toastId = toast.loading("Creating simulated account...");

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          county,
          password,
          role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed.");
      }

      setStatus("success");
      const successMessage = "Simulated account created. You can continue without Supabase.";
      setMessage(successMessage);
      toast.success(successMessage, { id: toastId });
      toast("Email delivery skipped in simulation mode.");
      setFullName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Registration failed.";
      setStatus("error");
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
                Account registry
              </p>
            </div>
          </Link>

          <Link
            href="/"
            className="hidden border border-[#1B3022]/15 px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-widest text-[#1B3022]/70 transition hover:border-[#D97757] hover:text-[#D97757] sm:inline-flex"
          >
            Back to platform
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-5 py-8 lg:grid-cols-[0.86fr_1.14fr] lg:py-12">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1B3022] p-7 text-[#FDFCFB] shadow-xl"
          >
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-[#D97757]">
              Secure onboarding
            </p>
            <h1 className="mt-3 max-w-xl font-serif text-4xl font-black leading-tight tracking-tight sm:text-5xl">
              Register for verified agricultural escrow access.
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-6 text-[#FDFCFB]/75">
              Create the identity used by the Investor Hub, Farmer Terminal,
              Field Agent desk, or Compliance console.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-3">
              {[
                ["4", "role workspaces"],
                ["KES", "escrow-first records"],
                ["100%", "simulated auth"],
                ["Local", "cookie session"],
              ].map(([value, label]) => (
                <div
                  key={label}
                  className="border border-[#FDFCFB]/10 bg-[#FDFCFB]/5 p-4"
                >
                  <p className="font-serif text-2xl font-black text-[#FDFCFB]">
                    {value}
                  </p>
                  <p className="mt-1 font-mono text-[9px] font-bold uppercase tracking-widest text-[#FDFCFB]/45">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="border border-[#1B3022]/10 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 border-b border-[#1B3022]/10 pb-3">
              <Lock className="h-4 w-4 text-[#D97757]" />
              <h2 className="font-serif text-base font-black text-[#1B3022]">
                Simulation flow
              </h2>
            </div>
            <div className="mt-4 space-y-3 text-xs leading-5 text-[#1B3022]/65">
              <p>1. A simulated auth profile is created by the API route.</p>
              <p>2. Role and session cookies are set for the route guard.</p>
              <p>
                3. The app can route the user into the matching dashboard
                workspace.
              </p>
            </div>
          </div>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          onSubmit={handleSubmit}
          className="border border-[#1B3022]/10 bg-white p-5 shadow-sm sm:p-7"
        >
          <div className="flex flex-col gap-2 border-b border-[#1B3022]/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-[#D97757]">
                Identity profile
              </p>
              <h2 className="mt-1 font-serif text-2xl font-black tracking-tight text-[#1B3022]">
                Create account
              </h2>
            </div>
            <div className="inline-flex items-center gap-2 bg-[#F5F2EF] px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-widest text-[#1B3022]/60">
              <Wallet className="h-3.5 w-3.5 text-[#D97757]" />
              Escrow ready
            </div>
          </div>

          <div className="mt-5">
            <label className="mb-2 block font-mono text-[9px] font-bold uppercase tracking-widest text-[#D97757]">
              Workspace role
            </label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {roleOptions.map((option) => {
                const Icon = option.icon;
                const isActive = option.id === role;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setRole(option.id)}
                    className={`min-h-28 border p-4 text-left transition ${
                      isActive
                        ? "border-[#1B3022] bg-[#1B3022] text-[#FDFCFB] shadow-md"
                        : "border-[#1B3022]/10 bg-[#FDFCFB] text-[#1B3022] hover:border-[#D97757]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <Icon
                        className={`h-5 w-5 ${isActive ? "text-[#D97757]" : "text-[#1B3022]/60"}`}
                      />
                      {isActive && (
                        <CheckCircle className="h-4 w-4 text-emerald-300" />
                      )}
                    </div>
                    <p className="mt-3 font-serif text-sm font-black">
                      {option.label}
                    </p>
                    <p
                      className={`mt-1 text-[11px] leading-4 ${isActive ? "text-[#FDFCFB]/70" : "text-[#1B3022]/55"}`}
                    >
                      {option.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Full name">
              <input
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                required
                placeholder={
                  selectedRole.id === "farmer"
                    ? "Ezekiel Kiprotich"
                    : "Joel Ndoho"
                }
                className="w-full border border-[#1B3022]/15 bg-[#FDFCFB] px-3 py-2.5 text-sm font-semibold text-[#1B3022] outline-none transition placeholder:text-[#1B3022]/30 focus:border-[#D97757]"
              />
            </Field>

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

            <Field label="Phone">
              <input
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="+254 700 000 000"
                className="w-full border border-[#1B3022]/15 bg-[#FDFCFB] px-3 py-2.5 text-sm font-semibold text-[#1B3022] outline-none transition placeholder:text-[#1B3022]/30 focus:border-[#D97757]"
              />
            </Field>

            <Field label="Primary county">
              <select
                value={county}
                onChange={(event) => setCounty(event.target.value)}
                className="w-full border border-[#1B3022]/15 bg-[#FDFCFB] px-3 py-2.5 text-sm font-semibold text-[#1B3022] outline-none transition focus:border-[#D97757]"
              >
                {counties.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Password">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
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
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </Field>

            <Field label="Confirm password">
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
                  minLength={8}
                  className="w-full border border-[#1B3022]/15 bg-[#FDFCFB] px-3 py-2.5 pr-11 text-sm font-semibold text-[#1B3022] outline-none transition focus:border-[#D97757]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((value) => !value)}
                  className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-[#1B3022]/50 transition hover:text-[#D97757]"
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                  title={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </Field>
          </div>

          {message && (
            <div
              className={`mt-5 border px-4 py-3 text-xs font-semibold leading-5 ${
                status === "success"
                  ? "border-emerald-700/15 bg-emerald-50 text-emerald-900"
                  : "border-red-700/15 bg-red-50 text-red-900"
              }`}
              aria-live="polite"
            >
              {message}
            </div>
          )}

          <div className="mt-6 flex flex-col gap-3 border-t border-[#1B3022]/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-sm text-[11px] leading-5 text-[#1B3022]/55">
              Your selected role is{" "}
              <strong className="text-[#1B3022]">{selectedRole.label}</strong>.
              Access can be reconnected to Supabase when production auth is ready.
            </p>
            <button
              type="submit"
              disabled={status === "loading"}
              className="inline-flex h-11 items-center justify-center gap-2 bg-[#1B3022] px-5 font-mono text-[10px] font-bold uppercase tracking-widest text-white shadow-sm transition hover:bg-[#243d2c] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "loading" ? "Creating account..." : "Create account"}
              <ArrowRight className="h-4 w-4 text-[#D97757]" />
            </button>
          </div>
        </motion.form>
      </section>
    </main>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-[9px] font-bold uppercase tracking-widest text-[#D97757]">
        {label}
      </span>
      {children}
    </label>
  );
}
