import React from 'react';
import { ArrowRight, ShieldCheck, Activity, Cpu, BarChart3, CheckCircle2 } from 'lucide-react';
import { CarbonIQLogo } from './CarbonIQLogo';

interface LandingPageProps {
  onGetStarted: () => void;
  onSignIn: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onSignIn,
}) => {
  return (
    <div className="relative min-h-screen bg-[#0B0D10] text-[#F5F6F7] flex flex-col justify-between overflow-hidden">
      {/* Animated Hero Background (Mesh & Floating Glow Blobs from Section 7.3) */}
      <div className="hero-background" />

      {/* Hero Header / Navigation Barlet */}
      <nav className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <CarbonIQLogo size="md" />

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 bg-[#16181C] border border-[#26292F] px-2.5 py-1 rounded-full text-xs">
            <span className="w-2 h-2 rounded-full bg-[#34D399] animate-ping" />
            <span className="text-[#34D399] font-medium font-mono">v2.4 Live</span>
          </div>

          <button
            onClick={onSignIn}
            className="py-1.5 px-4 rounded-lg border border-[#26292F] bg-[#16181C]/80 hover:bg-[#16181C] hover:border-[#34D399]/40 text-sm font-medium text-[#F5F6F7] transition-all"
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* Main Hero Container */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-8 pb-16 max-w-3xl mx-auto">
        {/* Trust Pill */}
        <div className="inline-flex items-center gap-2 bg-[#16181C] border border-[#26292F] px-3.5 py-1.5 rounded-full mb-5 shadow-sm">
          <ShieldCheck className="w-4 h-4 text-[#34D399]" />
          <span className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">
            Enterprise Carbon Engine
          </span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#F5F6F7] leading-tight">
          Turn Carbon Data <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5F6F7] via-[#5af0b3] to-[#34D399]">
            Into Action
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-[#9CA3AF] mt-4 max-w-xl leading-relaxed">
          Track emissions, allocate your sustainability budget, and cut carbon with AI-driven recommendations.
        </p>

        {/* Hero CTA Stack */}
        <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
          <button
            onClick={onGetStarted}
            className="w-full sm:w-auto py-3.5 px-7 bg-[#34D399] hover:bg-[#2ec58e] text-[#003825] font-semibold text-base rounded-lg transition-all flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(52,211,153,0.35)] hover:shadow-[0_0_32px_rgba(52,211,153,0.5)] active:scale-[0.99] cursor-pointer"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onSignIn}
            className="w-full sm:w-auto py-3.5 px-7 bg-[#16181C] hover:bg-[#1F2228] border border-[#26292F] text-[#F5F6F7] font-semibold text-base rounded-lg transition-all active:scale-[0.99] cursor-pointer"
          >
            Sign In
          </button>
        </div>

        {/* Data-free onboarding status */}
        <div className="w-full grid grid-cols-2 gap-3 mt-10 max-w-lg">
          <div className="bg-[#16181C] border border-[#26292F] p-4 rounded-xl text-left flex flex-col justify-between shadow-sm">
            <div className="flex items-center gap-2 text-[#9CA3AF] text-xs">
              <Activity className="w-3.5 h-3.5 text-[#34D399]" />
              <span className="font-medium">Activity data</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[#F5F6F7] mt-1.5 tracking-tight font-mono">
              0 <span className="text-[#34D399] text-lg">records</span>
            </div>
            <div className="mt-2 inline-flex items-center self-start gap-1 bg-[#26292F]/60 px-2 py-0.5 rounded-full text-[11px] text-[#34D399] font-medium font-mono">
              Ready to connect
            </div>
          </div>

          <div className="bg-[#16181C] border border-[#26292F] p-4 rounded-xl text-left flex flex-col justify-between shadow-sm">
            <div className="flex items-center gap-2 text-[#9CA3AF] text-xs">
              <Cpu className="w-3.5 h-3.5 text-[#34D399]" />
              <span className="font-medium">Reduction projects</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[#F5F6F7] mt-1.5 tracking-tight font-mono">
              0 <span className="text-[#9CA3AF] text-lg">projects</span>
            </div>
            <div className="mt-2 inline-flex items-center self-start gap-1 bg-[#26292F]/60 px-2 py-0.5 rounded-full text-[11px] text-[#9CA3AF] font-medium font-mono">
              Add your own data
            </div>
          </div>
        </div>

        {/* Core Capabilities Section Header */}
        <div className="w-full flex items-center justify-between mt-12 mb-3 px-1 max-w-2xl">
          <span className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">
            Core Capabilities
          </span>
          <span className="text-xs text-[#34D399] flex items-center gap-1.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#34D399]" />
            Zero Emission Cloud
          </span>
        </div>

        {/* Feature Cards 3-in-a-row or stacked */}
        <div className="w-full flex flex-col gap-3 max-w-2xl text-left">
          {/* Feature Card 1 */}
          <div className="bg-[#16181C] border border-[#26292F] p-4 rounded-xl flex items-start gap-4 transition-all hover:bg-[#1F2228]/80 hover:border-[#34D399]/40">
            <div className="p-2.5 rounded-lg bg-[#26292F] text-[#34D399] shrink-0 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-semibold text-[#F5F6F7]">
                  Real-Time Emission Tracking
                </h3>
                <span className="w-2 h-2 rounded-full bg-[#34D399]" />
              </div>
              <p className="text-xs sm:text-sm text-[#9CA3AF] mt-1 leading-relaxed">
                Log industrial activities and compute CO2 in seconds with instant automated telemetry.
              </p>
            </div>
          </div>

          {/* Feature Card 2 */}
          <div className="bg-[#16181C] border border-[#26292F] p-4 rounded-xl flex items-start gap-4 transition-all hover:bg-[#1F2228]/80 hover:border-[#34D399]/40">
            <div className="p-2.5 rounded-lg bg-[#26292F] text-[#5af0b3] shrink-0 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-semibold text-[#F5F6F7]">
                  AI Budget Optimizer
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-[#9CA3AF] mt-1 leading-relaxed">
                Prioritize the reduction projects and financial assumptions you add to your workspace.
              </p>
            </div>
          </div>

          {/* Feature Card 3 */}
          <div className="bg-[#16181C] border border-[#26292F] p-4 rounded-xl flex items-start gap-4 transition-all hover:bg-[#1F2228]/80 hover:border-[#34D399]/40">
            <div className="p-2.5 rounded-lg bg-[#26292F] text-[#9CA3AF] shrink-0 flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-semibold text-[#F5F6F7]">
                  Actionable Reports
                </h3>
                <span className="text-[11px] px-1.5 py-0.5 rounded bg-[#26292F] text-[#9CA3AF] font-mono">
                  Audit Ready
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#9CA3AF] mt-1 leading-relaxed">
                Audit-ready summaries with CSV and PDF instant export ready for regulatory boards.
              </p>
            </div>
          </div>
        </div>

        {/* Analytical Signal Micro-Banner */}
        <div className="w-full max-w-2xl bg-[#16181C]/60 border border-[#26292F] p-3 rounded-xl mt-6 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-[#F5F6F7]">
            <CheckCircle2 className="w-4 h-4 text-[#34D399]" />
            <span className="font-medium">GHG Protocol Compliant</span>
          </div>
          <span className="text-[#9CA3AF] font-mono">ISO 14064-1</span>
        </div>
      </main>

      {/* Global Footer */}
      <footer className="relative z-10 w-full py-6 border-t border-[#26292F]/60 flex flex-col items-center justify-center text-center px-4">
        <CarbonIQLogo size="sm" />
        <p className="text-xs text-[#9CA3AF] mt-2">
          © 2025 CarbonIQ Inc. All rights reserved.
        </p>
      </footer>
    </div>
  );
};
