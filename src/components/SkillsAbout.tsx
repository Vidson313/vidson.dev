import { useState } from 'react';
import { Layout, Server, Database, Terminal, CheckCircle2, Briefcase, MapPin, Calendar, ArrowUpRight } from 'lucide-react';
import { SKILL_CATEGORIES, EXPERIENCES, ABOUT_TEXT } from '../data/portfolioData';

export default function SkillsAbout() {
  const [activeTab, setActiveTab] = useState<number>(0);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Layout':
        return <Layout className="w-4 h-4 text-[#FF5C00]" />;
      case 'Server':
        return <Server className="w-4 h-4 text-[#FF5C00]" />;
      case 'Database':
        return <Database className="w-4 h-4 text-[#FF5C00]" />;
      default:
        return <Terminal className="w-4 h-4 text-[#FF5C00]" />;
    }
  };

  return (
    <section id="skills" className="py-24 px-6 sm:px-8 max-w-7xl mx-auto border-t border-white/[0.08]">
      {/* Section Header */}
      <div id="about" className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 font-mono-code text-sm text-[#FF5C00] uppercase tracking-wider mb-2">
            <span>02 //</span>
            <span>Skills & Experience</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-grotesk font-bold text-white uppercase">
            Technical Stack & Pedigree.
          </h2>
        </div>
        <p className="mt-4 sm:mt-0 text-sm font-mono-code text-white/50 max-w-md">
          A full-spectrum engineering arsenal refined through a decade of shipping mission-critical web applications.
        </p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* Left Column: About & Career Timeline (7 cols) */}
        <div className="lg:col-span-6 space-y-12">
          {/* About Narrative Block */}
          <div className="p-8 rounded-lg bg-[#141414] border border-white/[0.08] relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6 font-mono-code text-xs text-white/40 border-b border-white/5 pb-4">
              <Terminal className="w-4 h-4 text-[#FF5C00]" />
              <span>ARCHITECT_PROFILE // MANIFEST</span>
              <span className="ml-auto text-emerald-400">STATUS: VERIFIED</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-grotesk font-bold text-white leading-tight mb-4">
              {ABOUT_TEXT.headline}
            </h3>

            <div className="space-y-4 text-sm text-white/70 leading-relaxed font-body">
              {ABOUT_TEXT.paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            {/* Micro Stats & Badges */}
            <div className="mt-8 pt-6 border-t border-white/5 grid grid-cols-2 gap-4 text-xs font-mono-code">
              <div>
                <span className="text-white/40 block">LOCATION</span>
                <span className="text-white font-medium flex items-center gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#FF5C00]" />
                  {ABOUT_TEXT.location}
                </span>
              </div>

              <div>
                <span className="text-white/40 block">CONTRACT STATUS</span>
                <span className="text-white font-medium flex items-center gap-1.5 mt-1">
                  <span className="w-2 h-2 rounded-full bg-[#FF5C00] animate-pulse" />
                  Q3/Q4 Available
                </span>
              </div>
            </div>
          </div>

          {/* Career Experience Timeline */}
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2 font-mono-code text-xs text-white/60 uppercase tracking-wider">
                <Briefcase className="w-4 h-4 text-[#FF5C00]" />
                <span>Career Milestones</span>
              </div>
              <span className="font-mono-code text-xs text-[#FF5C00]">2016 — 2025</span>
            </div>

            <div className="relative pl-6 sm:pl-8 space-y-10 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-[#FF5C00] before:via-white/20 before:to-white/5">
              {EXPERIENCES.map((exp, idx) => (
                <div key={idx} className="relative group">
                  {/* Glowing Timeline Dot */}
                  <div className="absolute -left-[29px] sm:-left-[37px] top-1.5 w-3.5 h-3.5 rounded-full bg-[#0A0A0A] border-2 border-[#FF5C00] group-hover:bg-[#FF5C00] transition-colors" />

                  {/* Role Header */}
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h4 className="text-lg font-grotesk font-bold text-white group-hover:text-[#FF5C00] transition-colors">
                      {exp.role}
                    </h4>
                    <span className="text-xs font-mono-code text-[#FF5C00] px-2 py-0.5 rounded bg-[#FF5C00]/10">
                      {exp.period}
                    </span>
                  </div>

                  <div className="text-sm font-mono-code text-white/70 mt-1">
                    {exp.company} <span className="text-white/30">•</span> {exp.location}
                  </div>

                  <p className="mt-3 text-sm text-white/60 leading-relaxed font-body">
                    {exp.description}
                  </p>

                  {/* Achievements bullet */}
                  <ul className="mt-3 space-y-1.5 text-xs text-white/75 font-mono-code">
                    {exp.achievements.map((ach, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#FF5C00] mt-0.5">›</span>
                        <span>{ach}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Technologies */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {exp.technologies.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 text-[10px] font-mono-code rounded bg-white/5 border border-white/5 text-white/70"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Categorized Technical Skills (5 cols) */}
        <div className="lg:col-span-6 space-y-8">
          <div className="p-6 sm:p-8 rounded-lg bg-[#141414] border border-white/[0.08] space-y-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="font-mono-code text-xs text-white/50 uppercase tracking-wider">
                COMPETENCY MATRIX // VERIFIED
              </span>
              <span className="text-xs font-mono-code text-[#FF5C00]">
                90%+ PRODUCTION MASTERY
              </span>
            </div>

            {/* Categorized Skills */}
            <div className="space-y-8">
              {SKILL_CATEGORIES.map((cat, catIdx) => (
                <div key={catIdx} className="space-y-4">
                  {/* Category Title with Icon */}
                  <div className="flex items-center gap-2.5 pb-2 border-b border-white/5">
                    {getCategoryIcon(cat.iconName)}
                    <h3 className="font-grotesk font-bold text-base text-white tracking-wide">
                      {cat.title}
                    </h3>
                  </div>

                  {/* Skill Items */}
                  <div className="space-y-4">
                    {cat.skills.map((skill, sIdx) => (
                      <div key={sIdx} className="group">
                        <div className="flex items-center justify-between text-xs font-mono-code mb-1.5">
                          <span className="text-white/90 font-medium group-hover:text-white transition-colors">
                            {skill.name}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-white/40 text-[11px]">{skill.experience}</span>
                            <span className="text-[#FF5C00] font-bold">{skill.level}%</span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#FF5C00]/60 to-[#FF5C00] rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${skill.level}%` }}
                          />
                        </div>

                        <div className="mt-1 text-[11px] font-mono-code text-white/40 flex items-center gap-1">
                          <span className="text-[#FF5C00]/60">Focus:</span> {skill.focus}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dev-First Terminal Quick Fact Card */}
          <div className="p-5 rounded-lg bg-[#0A0A0A] border border-white/10 font-mono-code text-xs space-y-3">
            <div className="flex items-center justify-between text-white/40 pb-2 border-b border-white/5">
              <span>SYSTEM_STATS // VIDSON.DEV</span>
              <span className="text-emerald-400">UPTIME: 99.99%</span>
            </div>
            <div className="space-y-1.5 text-white/70">
              <p>
                <span className="text-[#FF5C00]">$</span> code_principles --list
              </p>
              <p className="text-white/50 pl-3">→ Zero unneeded third-party runtime bloat</p>
              <p className="text-white/50 pl-3">→ Strict TypeScript compile checks (no-any)</p>
              <p className="text-white/50 pl-3">→ Sub-100ms API response targets</p>
              <p className="text-white/50 pl-3">→ Accessible, keyboard-first UI architecture</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
