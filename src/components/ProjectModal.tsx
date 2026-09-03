import { useEffect } from 'react';
import { X, ExternalLink, Github, CheckCircle, Terminal, Layers, Activity } from 'lucide-react';
import { Project } from '../types';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-project-title"
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] bg-[#141414] border border-white/10 rounded-lg shadow-2xl overflow-y-auto subtle-glow text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header Bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-[#141414]/95 backdrop-blur-md border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5C00]" />
            <span className="font-mono-code text-xs text-[#FF5C00] uppercase tracking-wider">
              {project.category}
            </span>
            {project.badge && (
              <span className="hidden sm:inline-block text-[11px] font-mono-code px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/70">
                {project.badge}
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-[#FF5C00] hover:text-black transition-colors text-white/70"
            aria-label="Close project modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Title & Subtitle */}
          <div>
            <h2 id="modal-project-title" className="text-3xl sm:text-4xl font-grotesk font-bold text-white">
              {project.title}
            </h2>
            <p className="mt-2 text-base sm:text-lg text-white/70 font-normal leading-relaxed">
              {project.subtitle}
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-lg bg-[#0A0A0A] border border-white/5">
            {project.metrics.map((m, idx) => (
              <div key={idx}>
                <span className="text-2xl font-grotesk font-bold text-[#FF5C00]">
                  {m.value}
                </span>
                <p className="text-xs font-mono-code text-white/50 mt-0.5">
                  {m.label}
                </p>
              </div>
            ))}
          </div>

          {/* Problem & Solution Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-lg bg-[#0A0A0A] border border-white/5">
              <div className="flex items-center gap-2 mb-3 text-[#FF5C00] font-mono-code text-xs uppercase tracking-wider">
                <Activity className="w-4 h-4" />
                <span>The Engineering Challenge</span>
              </div>
              <p className="text-sm text-white/80 leading-relaxed">
                {project.problem}
              </p>
            </div>

            <div className="p-5 rounded-lg bg-[#0A0A0A] border border-white/5">
              <div className="flex items-center gap-2 mb-3 text-white font-mono-code text-xs uppercase tracking-wider">
                <CheckCircle className="w-4 h-4 text-[#FF5C00]" />
                <span>The Architectural Solution</span>
              </div>
              <p className="text-sm text-white/80 leading-relaxed">
                {project.solution}
              </p>
            </div>
          </div>

          {/* Key Architectural Highlights */}
          <div className="p-5 rounded-lg bg-[#0A0A0A] border border-white/5">
            <div className="flex items-center gap-2 mb-4 font-mono-code text-xs text-white/60 uppercase tracking-wider">
              <Layers className="w-4 h-4 text-[#FF5C00]" />
              <span>Core Architectural Highlights</span>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-white/80 font-mono-code">
              {project.architecture.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="text-[#FF5C00] mt-0.5">›</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech Stack Chips */}
          <div>
            <span className="block font-mono-code text-xs text-white/50 mb-3 uppercase tracking-wider">
              Technologies & Infrastructure
            </span>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 text-xs font-mono-code rounded-md bg-white/5 border border-white/10 text-white/90"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Code Snippet Box */}
          {project.codeSnippet && (
            <div className="rounded-lg bg-[#0A0A0A] border border-white/10 overflow-hidden font-mono-code text-xs">
              <div className="flex items-center justify-between px-4 py-2.5 bg-white/5 border-b border-white/5 text-white/40">
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-[#FF5C00]" />
                  <span>core_pipeline.rs / ts</span>
                </div>
                <span className="text-[11px] text-white/30">production snippet</span>
              </div>
              <pre className="p-4 overflow-x-auto text-white/80 leading-relaxed">
                <code>{project.codeSnippet}</code>
              </pre>
            </div>
          )}

          {/* Footer Action Links */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
            <div className="flex items-center gap-4">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-mono-code text-white/70 hover:text-white transition-colors"
                >
                  <Github className="w-4 h-4" />
                  <span>Inspect Source</span>
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-mono-code text-[#FF5C00] hover:underline"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Live Staging Demo</span>
                </a>
              )}
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white font-mono-code text-xs uppercase tracking-wider rounded-lg transition-colors"
            >
              Close Case Study
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
