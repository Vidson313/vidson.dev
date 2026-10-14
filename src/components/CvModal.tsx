import { useEffect } from 'react';
import { X, Download, Printer, Copy, Check, Terminal, Award, FileText } from 'lucide-react';
import { EXPERIENCES, SKILL_CATEGORIES, ABOUT_TEXT } from '../data/portfolioData';

interface CvModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export default function CvModal({ isOpen, onClose, onShowToast }: CvModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyMarkdown = () => {
    const md = `# Amin Seraj (VIDSON.DEV) — Senior Full-Stack Engineer
Email: ${ABOUT_TEXT.email} | Location: ${ABOUT_TEXT.location} | Website: https://aminseraj.eu.cc/ | Telegram: https://t.me/MHMD_DEVVV | GitHub: https://github.com/Vidson313

## Summary
${ABOUT_TEXT.paragraphs.join('\n\n')}

## Core Stack
- Frontend: React 19, Next.js 15, TypeScript, Tailwind CSS, State Machines
- Backend: Node.js, Go, Rust, PostgreSQL, ClickHouse, Redis, Kafka
- Cloud: Docker, Kubernetes, AWS, Cloudflare Workers, CI/CD

## Experience
${EXPERIENCES.map((e) => `### ${e.role} — ${e.company} (${e.period})\n${e.description}\n${e.achievements.map((a) => `- ${a}`).join('\n')}`).join('\n\n')}
`;
    navigator.clipboard.writeText(md);
    onShowToast('Markdown CV copied to clipboard!');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cv-title"
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] bg-[#141414] border border-white/15 rounded-lg shadow-2xl overflow-y-auto subtle-glow text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-[#141414]/95 backdrop-blur-md border-b border-white/10">
          <div className="flex items-center gap-2 font-mono-code text-xs text-white/60">
            <FileText className="w-4 h-4 text-[#FF5C00]" />
            <span className="text-white font-semibold">CURRICULUM_VITAE.pdf</span>
            <span className="text-[#FF5C00] ml-1">● READY</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyMarkdown}
              className="p-2 rounded bg-white/5 hover:bg-white/10 text-xs font-mono-code text-white/80 transition-colors flex items-center gap-1.5"
              title="Copy as Markdown"
            >
              <Copy className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Copy MD</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-[#FF5C00] text-black font-semibold text-xs font-mono-code rounded hover:bg-[#ff7526] transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/20 text-white/70 ml-2"
              aria-label="Close CV preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CV Document Body */}
        <div className="p-8 sm:p-12 space-y-8 bg-[#0d0d0d] font-body text-sm leading-relaxed">
          {/* Header */}
          <div className="border-b border-white/10 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <h1 id="cv-title" className="text-3xl font-grotesk font-bold text-white tracking-tight">
                Amin Seraj
              </h1>
              <span className="font-mono-code text-xs text-[#FF5C00]">
                VIDSON.DEV // Senior Full-Stack Engineer
              </span>
            </div>
            <div className="mt-2 text-xs font-mono-code text-white/60 flex flex-wrap gap-4">
              <span>{ABOUT_TEXT.location}</span>
              <span>•</span>
              <a href={`mailto:${ABOUT_TEXT.email}`} className="text-white hover:text-[#FF5C00] transition-colors">{ABOUT_TEXT.email}</a>
              <span>•</span>
              <a href="https://aminseraj.eu.cc/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#FF5C00] transition-colors">aminseraj.eu.cc</a>
              <span>•</span>
              <a href="https://t.me/MHMD_DEVVV" target="_blank" rel="noopener noreferrer" className="text-[#FF5C00] hover:underline">@MHMD_DEVVV</a>
            </div>
          </div>

          {/* Executive Summary */}
          <div>
            <h2 className="text-xs font-mono-code text-[#FF5C00] uppercase tracking-wider mb-2">
              01 // Professional Summary
            </h2>
            <p className="text-white/80 leading-relaxed text-sm">
              {ABOUT_TEXT.paragraphs[0]}
            </p>
          </div>

          {/* Core Technical Matrix */}
          <div>
            <h2 className="text-xs font-mono-code text-[#FF5C00] uppercase tracking-wider mb-3">
              02 // Technical Competencies
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-lg bg-[#141414] border border-white/5 font-mono-code text-xs">
              <div>
                <span className="text-white font-semibold block mb-1">Frontend</span>
                <span className="text-white/60">
                  React 19, Next.js 15, TypeScript, Tailwind, WebGL, Design Systems, State Machines
                </span>
              </div>
              <div>
                <span className="text-white font-semibold block mb-1">Backend</span>
                <span className="text-white/60">
                  Node.js, Go, Rust, Microservices, Kafka, GraphQL, REST, WebSocket Pipelines
                </span>
              </div>
              <div>
                <span className="text-white font-semibold block mb-1">Data & Cloud</span>
                <span className="text-white/60">
                  PostgreSQL, ClickHouse, Redis, Docker, Kubernetes, AWS, Cloudflare Workers
                </span>
              </div>
            </div>
          </div>

          {/* Work History */}
          <div>
            <h2 className="text-xs font-mono-code text-[#FF5C00] uppercase tracking-wider mb-4">
              03 // Experience & Impact
            </h2>
            <div className="space-y-6">
              {EXPERIENCES.map((exp, idx) => (
                <div key={idx} className="border-l-2 border-white/10 pl-4 space-y-2">
                  <div className="flex flex-wrap items-baseline justify-between gap-1">
                    <span className="font-grotesk font-bold text-white text-base">
                      {exp.role} — <span className="text-white/80 font-normal">{exp.company}</span>
                    </span>
                    <span className="font-mono-code text-xs text-[#FF5C00]">{exp.period}</span>
                  </div>
                  <p className="text-xs text-white/60">{exp.description}</p>
                  <ul className="space-y-1 text-xs text-white/75 font-mono-code">
                    {exp.achievements.map((ach, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-[#FF5C00]">›</span>
                        <span>{ach}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Education & Certs */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row justify-between gap-4 text-xs font-mono-code text-white/60">
            <div>
              <span className="text-white font-semibold block">Education</span>
              <span>B.S. in Computer Science & Engineering</span>
            </div>
            <div>
              <span className="text-white font-semibold block">Certifications</span>
              <span>AWS Certified Solutions Architect Professional</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
