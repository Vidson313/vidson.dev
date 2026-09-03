import { ArrowDown, ArrowRight, FileText, Code2, Terminal } from 'lucide-react';
import { TRUST_METRICS } from '../data/portfolioData';
import StaggeredHeadline from './StaggeredHeadline';

interface HeroProps {
  onOpenCvModal: () => void;
  onViewWorkClick: () => void;
}

export default function Hero({ onOpenCvModal, onViewWorkClick }: HeroProps) {
  return (
    <section
      id="hero"
      className="relative min-h-[92vh] flex flex-col justify-between pt-32 pb-16 px-6 sm:px-8 max-w-7xl mx-auto overflow-hidden"
    >
      {/* Background Dev Line Elements & Subtle Grid */}
      <div className="absolute inset-0 bg-dev-lines opacity-40 pointer-events-none -z-10" />
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-[#FF5C00]/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Tag / IDE Status line */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#141414] border border-white/10 font-mono-code text-xs text-white/80">
          <span className="w-2 h-2 rounded-full bg-[#FF5C00] animate-pulse" />
          <span className="text-[#FF5C00] font-semibold">vidson@production:~$</span>
          <span className="text-white/60">git status --clean</span>
        </div>

        <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141414]/60 border border-white/5 font-mono-code text-xs text-white/50">
          <Terminal className="w-3.5 h-3.5 text-[#FF5C00]" />
          <span>TypeScript 5.8 • React 19 • Cloud Architecture</span>
        </div>
      </div>

      {/* Main Hero Headline with Staggered Type-In Animation */}
      <div className="max-w-5xl">
        <StaggeredHeadline />

        {/* Subtitle (~20 words) */}
        <p className="mt-8 max-w-2xl text-lg sm:text-xl text-white/70 font-normal leading-relaxed">
          Architecting high-throughput cloud backends, resilient TypeScript ecosystems, and fluid frontend interfaces for ambitious founders and product teams.
        </p>

        {/* Two CTAs */}
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <button
            onClick={onViewWorkClick}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-[#FF5C00] text-black font-bold text-sm tracking-wider uppercase rounded-lg hover:bg-[#ff7526] active:scale-95 transition-all duration-200 shadow-xl shadow-[#FF5C00]/20 cursor-pointer"
          >
            <span>View My Work</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onOpenCvModal}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-[#141414] border border-white/20 text-white font-medium text-sm tracking-wider uppercase rounded-lg hover:border-white/50 hover:bg-[#1f1f1f] active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <FileText className="w-4 h-4 text-white/70 group-hover:text-[#FF5C00] transition-colors" />
            <span>Download CV</span>
          </button>

          <div className="hidden xl:flex items-center gap-2 pl-4 text-xs font-mono-code text-white/40">
            <Code2 className="w-4 h-4 text-[#FF5C00]" />
            <span>100% Production-Tested • Awwwards Recognized</span>
          </div>
        </div>
      </div>

      {/* Trust Metrics Bar */}
      <div className="mt-16 sm:mt-24 pt-10 border-t border-white/[0.08]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          {TRUST_METRICS.map((metric, idx) => (
            <div
              key={idx}
              className="p-4 rounded-lg bg-[#141414]/40 border border-white/[0.06] hover:border-[#FF5C00]/30 transition-colors group"
            >
              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-grotesk font-bold text-white group-hover:text-[#FF5C00] transition-colors">
                  {metric.value}
                </span>
              </div>
              <p className="mt-1 text-sm font-semibold text-white/90">
                {metric.label}
              </p>
              <p className="text-xs font-mono-code text-white/50 mt-0.5">
                {metric.subtext}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Scroll Indicator */}
      <div className="mt-12 flex items-center justify-between text-xs font-mono-code text-white/40">
        <div className="flex items-center gap-2">
          <span className="text-[#FF5C00]">00 //</span>
          <span>SYSTEM_READY</span>
        </div>

        <button
          onClick={onViewWorkClick}
          className="flex items-center gap-2 text-white/50 hover:text-[#FF5C00] transition-colors cursor-pointer"
          aria-label="Scroll to selected work"
        >
          <span className="tracking-wider uppercase">Scroll Down</span>
          <ArrowDown className="w-3.5 h-3.5 animate-bounce text-[#FF5C00]" />
        </button>
      </div>
    </section>
  );
}
