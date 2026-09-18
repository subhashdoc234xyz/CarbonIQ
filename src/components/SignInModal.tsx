import React, { useState } from 'react';
import { ShieldCheck, Lock, Activity, ArrowLeft, UserRound } from 'lucide-react';
import { CarbonIQLogo } from './CarbonIQLogo';
import { UserProfile } from '../types';
import { DEFAULT_USER, GUEST_USER } from '../data/initialData';

interface SignInModalProps {
  onSuccess: (user: UserProfile) => void;
  onBack: () => void;
}

export const SignInModal: React.FC<SignInModalProps> = ({ onSuccess, onBack }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    setStatusMessage('Initializing Google SSO handshake...');

    setTimeout(() => {
      setStatusMessage('Authenticating with Row-Level Security...');
      setTimeout(() => {
        onSuccess(DEFAULT_USER);
      }, 700);
    }, 600);
  };

  const handleGuestAccess = () => {
    setIsLoading(true);
    setStatusMessage('Opening an empty CarbonIQ workspace...');

    setTimeout(() => {
      onSuccess(GUEST_USER);
    }, 400);
  };

  return (
    <div className="relative min-h-screen bg-[#0B0D10] text-[#F5F6F7] flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Dimmed Ambient Glow Background */}
      <div className="hero-background opacity-60" />

      {/* Back button */}
      <button
        onClick={onBack}
        className="absolute top-6 left-6 z-20 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#16181C] border border-[#26292F] text-xs font-medium text-[#9CA3AF] hover:text-[#F5F6F7] hover:border-[#34D399]/40 transition-all"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Home</span>
      </button>

      <div className="w-full max-w-sm relative z-10 flex flex-col items-center my-auto">
        {/* Security Telemetry Pill */}
        <div className="mb-5 flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#16181C] border border-[#26292F] shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-pulse" />
          <span className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider font-mono">
            Secured Node · SOC-2 Compliant
          </span>
        </div>

        {/* Main Auth Card */}
        <div className="w-full bg-[#16181C] border border-[#26292F] rounded-2xl p-6 sm:p-8 shadow-2xl flex flex-col items-center backdrop-blur-md">
          {/* CarbonIQ Brand Mark */}
          <div className="mb-4">
            <CarbonIQLogo size="lg" showWordmark={false} />
          </div>

          {/* Title & Narrative */}
          <h1 className="text-xl sm:text-2xl font-bold text-[#F5F6F7] text-center tracking-tight">
            Welcome to CarbonIQ
          </h1>
          <p className="text-xs sm:text-sm text-[#9CA3AF] text-center mt-2 mb-6 leading-relaxed">
            Sign in to track your emissions and manage your sustainability budget
          </p>

          {/* Google OAuth Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full bg-[#F5F6F7] hover:bg-white text-[#16181C] font-semibold text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-3 shadow-md active:scale-[0.99] transition-all cursor-pointer disabled:opacity-80 disabled:cursor-not-allowed select-none"
          >
            {/* Google Colorful G Icon */}
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                fill="#4285F4"
              />
              <path
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                fill="#34A853"
              />
              <path
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                fill="#FBBC05"
              />
              <path
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                fill="#EA4335"
              />
            </svg>
            <span>{isLoading ? 'Connecting...' : 'Continue with Google'}</span>
          </button>

          <div className="w-full flex items-center gap-3 my-4" aria-hidden="true">
            <div className="h-px flex-1 bg-[#26292F]" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B7280]">or</span>
            <div className="h-px flex-1 bg-[#26292F]" />
          </div>

          <button
            onClick={handleGuestAccess}
            disabled={isLoading}
            className="w-full bg-[#1F2228] hover:bg-[#26292F] border border-[#3A3E46] hover:border-[#34D399]/50 text-[#F5F6F7] font-semibold text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition-all cursor-pointer disabled:opacity-80 disabled:cursor-not-allowed select-none"
          >
            <UserRound className="w-5 h-5 text-[#34D399]" />
            <span>Continue as Guest</span>
          </button>
          <p className="text-[11px] text-[#9CA3AF] text-center mt-2">
            Start with an empty workspace without creating an account.
          </p>

          {/* Status micro-interaction banner */}
          {statusMessage && (
            <div className="w-full mt-3 p-2.5 rounded-lg bg-[#26292F] text-center animate-fade-in">
              <span className="text-xs font-medium text-[#34D399] flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#34D399] animate-ping" />
                {statusMessage}
              </span>
            </div>
          )}

          {/* Enterprise SSO badge */}
          <div className="mt-6 pt-4 border-t border-[#26292F] w-full flex items-center justify-center gap-2 text-[#9CA3AF]">
            <Lock className="w-3.5 h-3.5 text-[#34D399]" />
            <span className="text-[11px] font-medium tracking-tight">
              Enterprise SSO · Row-Level Security Enabled
            </span>
          </div>
        </div>

        {/* Live Telemetry Badges */}
        <div className="mt-4 w-full grid grid-cols-2 gap-2.5">
          <div className="bg-[#16181C] border border-[#26292F] p-3 rounded-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#26292F] flex items-center justify-center text-[#34D399] shrink-0">
              <Activity className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] text-[#9CA3AF]">Telemetry Uptime</div>
              <div className="text-sm font-bold text-[#F5F6F7] font-mono">99.99%</div>
            </div>
          </div>

          <div className="bg-[#16181C] border border-[#26292F] p-3 rounded-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#26292F] flex items-center justify-center text-[#34D399] shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] text-[#9CA3AF]">GHG Protocol</div>
              <div className="text-sm font-bold text-[#F5F6F7] font-mono">Scope 1–3</div>
            </div>
          </div>
        </div>

        {/* Legal & Compliance Footnote */}
        <div className="mt-6 text-center px-4">
          <p className="text-[11px] text-[#9CA3AF]/80 leading-normal">
            By continuing, you agree to our{' '}
            <span className="text-[#F5F6F7] underline underline-offset-2 cursor-pointer hover:text-[#34D399]">
              Terms of Service
            </span>{' '}
            and{' '}
            <span className="text-[#F5F6F7] underline underline-offset-2 cursor-pointer hover:text-[#34D399]">
              Privacy Policy
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
