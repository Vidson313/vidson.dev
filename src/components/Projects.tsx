import { useState } from 'react';
import { ArrowUpRight, Activity, Terminal, Shield, Sparkles, Sliders } from 'lucide-react';
import { Project } from '../types';
import { PROJECTS } from '../data/portfolioData';
import ProjectModal from './ProjectModal';

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const renderProjectVisual = (projectId: string) => {
    switch (projectId) {
      case 'krypton-cloud':
        return (
          <div className="w-full h-full bg-[#0d0d0d] p-5 flex flex-col justify-between font-mono-code text-xs relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
            {/* Terminal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500/80" />
                <span className="w-2 h-2 rounded-full bg-yellow-500/80" />
                <span className="w-2 h-2 rounded-full bg-[#FF5C00]" />
                <span className="text-white/40 text-[11px] ml-1">krypton-node-04 // clickhouse</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-[#FF5C00] bg-[#FF5C00]/10 px-2 py-0.5 rounded">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF5C00] animate-ping" />
                <span>1.4B EVENTS/DAY</span>
              </div>
            </div>

            {/* Metrics Chart Preview */}
            <div className="my-auto py-4">
              <div className="flex items-baseline justify-between text-white/60 mb-2">
                <span className="text-[11px]">Ingestion Pipeline P95</span>
                <span className="text-white font-bold text-lg text-[#FF5C00]">41.8 ms</span>
              </div>
              {/* Simulated sparkline bars */}
              <div className="flex items-end gap-1 h-16 w-full pt-2">
                {[45, 60, 52, 78, 65, 90, 85, 98, 72, 68, 84, 92, 76, 88, 95, 82, 89, 94, 99, 91].map(
                  (val, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-white/15 group-hover:bg-[#FF5C00]/70 transition-colors duration-300 rounded-t-sm"
                      style={{ height: `${val}%` }}
                    />
                  )
                )}
              </div>
            </div>

            {/* Bottom Status Ticker */}
            <div className="flex items-center justify-between text-[11px] text-white/40 pt-2 border-t border-white/5">
              <span>Kafka Cluster: 16 Partitions</span>
              <span className="text-white/80">Memory: 1.2GB / 8GB</span>
            </div>
          </div>
        );

      case 'sovereign-pay':
        return (
          <div className="w-full h-full bg-[#0d0d0d] p-5 flex flex-col justify-between font-mono-code text-xs relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-[#FF5C00]" />
                <span className="text-white/60 text-[11px]">PCI-DSS LEVEL 1 ROUTER</span>
              </div>
              <span className="text-[10px] text-white/80 bg-white/10 px-2 py-0.5 rounded">
                SETTLEMENT: INSTANT
              </span>
            </div>

            <div className="my-auto py-3 space-y-2.5">
              <div className="p-2.5 rounded bg-white/5 border border-white/5 flex items-center justify-between">
                <div>
                  <div className="text-white text-xs font-semibold font-grotesk">Global Merchant Settlement</div>
                  <div className="text-[10px] text-white/50">EUR • USD • GBP • JPY (36 Currencies)</div>
                </div>
                <div className="text-right">
                  <span className="text-[#FF5C00] font-bold text-sm">$84,120,400</span>
                  <div className="text-[9px] text-emerald-400">99.998% Idempotency</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-[10px] text-center">
                <div className="p-2 rounded bg-black/40 border border-white/5">
                  <div className="text-white/40">Fallbacks</div>
                  <div className="text-white font-bold">0.02%</div>
                </div>
                <div className="p-2 rounded bg-black/40 border border-white/5">
                  <div className="text-white/40">Latency</div>
                  <div className="text-[#FF5C00] font-bold">180ms</div>
                </div>
                <div className="p-2 rounded bg-black/40 border border-white/5">
                  <div className="text-white/40">Ledger</div>
                  <div className="text-emerald-400 font-bold">Balanced</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-white/40 pt-2 border-t border-white/5">
              <span>Dynamic Routing: Active</span>
              <span className="text-white/70">Cart Abandonment -28.4%</span>
            </div>
          </div>
        );

      case 'aura-clinical-ai':
        return (
          <div className="w-full h-full bg-[#0d0d0d] p-5 flex flex-col justify-between font-mono-code text-xs relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-[#FF5C00]" />
                <span className="text-white/60 text-[11px]">AMBIENT EHR STREAM // 48kHz</span>
              </div>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded">
                HIPAA ENCRYPTED
              </span>
            </div>

            {/* Audio Waveform Simulator */}
            <div className="my-auto py-3 space-y-3">
              <div className="flex items-center justify-between text-[11px] text-white/60">
                <span>Patient Consult Audio</span>
                <span className="text-[#FF5C00] animate-pulse">● Live Stream (3.8s Latency)</span>
              </div>
              <div className="flex items-center justify-center gap-1 h-10 px-2 rounded bg-black/50 border border-white/5">
                {[15, 30, 65, 45, 90, 80, 40, 75, 100, 60, 40, 85, 70, 30, 95, 55, 35, 75, 50, 20].map(
                  (h, i) => (
                    <div
                      key={i}
                      className="w-1 rounded-full bg-white/20 group-hover:bg-[#FF5C00] transition-colors duration-300"
                      style={{ height: `${h}%` }}
                    />
                  )
                )}
              </div>
              <div className="p-2 rounded bg-white/5 text-[10px] text-white/70 font-mono-code line-clamp-2">
                [SOAP Note]: Patient presents with acute respiratory congestion... ICD-10 J02.9 verified.
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-white/40 pt-2 border-t border-white/5">
              <span>Clinician Time Saved: 2.8 hrs/day</span>
              <span className="text-white/80">18 Clinical Sites</span>
            </div>
          </div>
        );

      case 'nexus-design-tokens':
        return (
          <div className="w-full h-full bg-[#0d0d0d] p-5 flex flex-col justify-between font-mono-code text-xs relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-3.5 h-3.5 text-[#FF5C00]" />
                <span className="text-white/60 text-[11px]">TOKEN COMPILER PIPELINE</span>
              </div>
              <span className="text-[10px] text-white/60 bg-white/10 px-2 py-0.5 rounded">
                12 TEAMS SYNCED
              </span>
            </div>

            <div className="my-auto py-3 space-y-2">
              <div className="p-3 rounded bg-white/5 border border-white/5 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-white/50">token: color.brand.primary</span>
                  <span className="text-[#FF5C00] font-bold">#FF5C00</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-white/50">WCAG 2.1 AA Contrast</span>
                  <span className="text-emerald-400 font-bold">4.82 : 1 (PASS)</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-white/50">Bundle Size Overhead</span>
                  <span className="text-white font-bold">&lt; 12KB Gzipped</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 py-1.5 px-3 rounded bg-[#FF5C00] text-black font-bold text-center text-[10px]">
                  Primitive Button
                </div>
                <div className="flex-1 py-1.5 px-3 rounded bg-white/10 text-white font-medium text-center text-[10px]">
                  Secondary Outline
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-white/40 pt-2 border-t border-white/5">
              <span>Web • iOS • Android Sync</span>
              <span className="text-[#FF5C00]">0.0% Regression Rate</span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section id="projects" className="py-24 px-6 sm:px-8 max-w-7xl mx-auto">
      {/* Section Header with Monospace Index */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 font-mono-code text-sm text-[#FF5C00] uppercase tracking-wider mb-2">
            <span>01 //</span>
            <span>Selected Work</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-grotesk font-bold text-white uppercase">
            Engineered For Scale.
          </h2>
        </div>
        <p className="mt-4 sm:mt-0 text-sm font-mono-code text-white/50 max-w-md">
          Curated selection of high-concurrency systems, fintech microservices, and design systems deployed in production.
        </p>
      </div>

      {/* 2-Column Desktop, 1-Column Mobile Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {PROJECTS.map((project) => (
          <div
            key={project.id}
            onClick={() => setSelectedProject(project)}
            className="group relative bg-[#141414] border border-white/[0.08] hover:border-[#FF5C00]/50 rounded-lg overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#FF5C00]/10 flex flex-col cursor-pointer"
          >
            {/* 16:10 Technical Canvas / Mockup Frame */}
            <div className="relative aspect-[16/10] w-full border-b border-white/[0.08] bg-[#0A0A0A] overflow-hidden">
              {renderProjectVisual(project.id)}

              {/* Hover overlay hint */}
              <div className="absolute inset-0 bg-[#0A0A0A]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-none">
                <span className="px-4 py-2 bg-[#FF5C00] text-black font-mono-code text-xs font-bold uppercase rounded-lg shadow-lg flex items-center gap-2">
                  <span>Open Deep Dive</span>
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </div>
            </div>

            {/* Card Information Body */}
            <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-6">
              <div>
                {/* Category in Monospace Orange */}
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono-code text-xs text-[#FF5C00] font-semibold tracking-wider uppercase">
                    {project.category}
                  </span>
                  {project.badge && (
                    <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/60">
                      {project.badge}
                    </span>
                  )}
                </div>

                {/* Project Title */}
                <h3 className="text-2xl font-grotesk font-bold text-white group-hover:text-[#FF5C00] transition-colors">
                  {project.title}
                </h3>

                {/* Summary / Subtitle */}
                <p className="mt-2 text-sm text-white/70 leading-relaxed font-normal">
                  {project.summary}
                </p>
              </div>

              {/* Tech Tags Chips */}
              <div className="space-y-4">
                <div className="flex flex-wrap gap-1.5">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 text-[11px] font-mono-code rounded bg-white/5 border border-white/5 text-white/80 group-hover:border-white/15 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Card CTA Link */}
                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono-code">
                  <span className="text-white/40">
                    P95: {project.metrics[1]?.value || 'Production'}
                  </span>

                  <span className="inline-flex items-center gap-1.5 text-[#FF5C00] font-bold group-hover:translate-x-1 transition-transform">
                    <span>View Case Study</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Project Deep Dive Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
