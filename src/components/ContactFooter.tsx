import { useState, FormEvent } from 'react';
import { ArrowUpRight, Copy, Check, Github, Linkedin, Twitter, Mail, ArrowUp, Send, Terminal, Clock } from 'lucide-react';
import { ABOUT_TEXT } from '../data/portfolioData';

interface ContactFooterProps {
  onShowToast: (msg: string) => void;
}

export default function ContactFooter({ onShowToast }: ContactFooterProps) {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedCommand, setCopiedCommand] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    budget: '$15k — $30k',
    timeline: 'Within 30 Days',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(ABOUT_TEXT.email);
    setCopiedEmail(true);
    onShowToast('Direct email copied to clipboard: ' + ABOUT_TEXT.email);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleCopyCommand = () => {
    const cmd = 'npx vidson-card';
    navigator.clipboard.writeText(cmd);
    setCopiedCommand(true);
    onShowToast(`CLI command copied: ${cmd}`);
    setTimeout(() => setCopiedCommand(false), 2500);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      onShowToast('Project brief received! I will reply within 12 hours.');
    }, 800);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const budgetOptions = ['$5k — $15k', '$15k — $30k', '$30k — $60k', 'Enterprise $60k+'];
  const timelineOptions = ['Immediate (1-2 weeks)', 'Within 30 Days', 'Next Quarter', 'Advisory / Retainer'];

  return (
    <footer id="contact" className="pt-24 pb-12 px-6 sm:px-8 max-w-7xl mx-auto border-t border-white/[0.08]">
      {/* Section Index */}
      <div className="flex items-center gap-2 font-mono-code text-sm text-[#FF5C00] uppercase tracking-wider mb-4">
        <span>03 //</span>
        <span>Initiate Collaboration</span>
      </div>

      {/* Hero Contact CTA */}
      <div className="max-w-4xl mb-16">
        <h2 className="text-4xl sm:text-6xl md:text-7xl font-grotesk font-bold text-white uppercase tracking-tight">
          Let's build something <span className="text-[#FF5C00]">great.</span>
        </h2>
        <p className="mt-6 text-lg text-white/70 max-w-2xl font-body leading-relaxed">
          Currently booking full-stack architecture, high-concurrency cloud systems, and production web applications for Q3/Q4. Let’s talk numbers, timeline, and execution.
        </p>
      </div>

      {/* Main Grid: Left Lead Gen Form, Right Fast Connect Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-20">
        {/* Lead Gen Form (7 cols) */}
        <div className="lg:col-span-7 bg-[#141414] border border-white/[0.08] p-8 rounded-lg relative">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/5 font-mono-code text-xs text-white/40">
            <span>DISPATCH // PROJECT INQUIRY</span>
            <span className="text-[#FF5C00]">AVG RESPONSE: &lt; 12H</span>
          </div>

          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#FF5C00]/20 text-[#FF5C00] flex items-center justify-center mx-auto">
                <Send className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-grotesk font-bold text-white">
                Inquiry Transmitted Successfully
              </h3>
              <p className="text-sm text-white/70 max-w-md mx-auto">
                Thank you, <span className="text-white font-semibold">{formData.name}</span>. I have received your project details and will review your scope within 12 hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-6 py-2 bg-white/10 hover:bg-white/20 text-xs font-mono-code uppercase rounded-lg text-white transition-colors"
              >
                Send Another Note
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono-code text-white/70 uppercase tracking-wider mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Alex Vance"
                    className="w-full px-4 py-3 bg-[#0A0A0A] border border-white/10 rounded-lg text-white placeholder-white/25 text-sm focus:outline-none focus:border-[#FF5C00] focus:ring-1 focus:ring-[#FF5C00] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono-code text-white/70 uppercase tracking-wider mb-2">
                    Work Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="alex@company.com"
                    className="w-full px-4 py-3 bg-[#0A0A0A] border border-white/10 rounded-lg text-white placeholder-white/25 text-sm focus:outline-none focus:border-[#FF5C00] focus:ring-1 focus:ring-[#FF5C00] transition-colors"
                  />
                </div>
              </div>

              {/* Budget Selector */}
              <div>
                <label className="block text-xs font-mono-code text-white/70 uppercase tracking-wider mb-2">
                  Expected Investment / Budget
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {budgetOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setFormData({ ...formData, budget: opt })}
                      className={`px-3 py-2 text-xs font-mono-code rounded-lg border text-center transition-all cursor-pointer ${
                        formData.budget === opt
                          ? 'border-[#FF5C00] bg-[#FF5C00]/10 text-[#FF5C00] font-bold'
                          : 'border-white/10 bg-[#0A0A0A] text-white/60 hover:text-white hover:border-white/30'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Timeline Selector */}
              <div>
                <label className="block text-xs font-mono-code text-white/70 uppercase tracking-wider mb-2">
                  Target Timeline
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {timelineOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setFormData({ ...formData, timeline: opt })}
                      className={`px-3 py-2 text-[11px] font-mono-code rounded-lg border text-center transition-all cursor-pointer ${
                        formData.timeline === opt
                          ? 'border-[#FF5C00] bg-[#FF5C00]/10 text-[#FF5C00] font-bold'
                          : 'border-white/10 bg-[#0A0A0A] text-white/60 hover:text-white hover:border-white/30'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-mono-code text-white/70 uppercase tracking-wider mb-2">
                  Project Scope / Objective
                </label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell me about the product, stack requirements, and key deliverables..."
                  className="w-full px-4 py-3 bg-[#0A0A0A] border border-white/10 rounded-lg text-white placeholder-white/25 text-sm focus:outline-none focus:border-[#FF5C00] focus:ring-1 focus:ring-[#FF5C00] transition-colors resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#FF5C00] hover:bg-[#ff7526] text-black font-bold uppercase tracking-wider text-sm rounded-lg flex items-center justify-center gap-2 active:scale-[0.99] transition-all cursor-pointer shadow-lg shadow-[#FF5C00]/20"
              >
                {isSubmitting ? (
                  <span>Transmitting Brief...</span>
                ) : (
                  <>
                    <span>Send Project Proposal</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Right Fast Connect Card (5 cols) */}
        <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
          {/* Direct Email Card */}
          <div className="p-8 rounded-lg bg-[#141414] border border-white/[0.08] space-y-6">
            <div className="flex items-center justify-between text-xs font-mono-code text-white/40 border-b border-white/5 pb-3">
              <span>DIRECT_CHANNEL</span>
              <span className="text-emerald-400">ENCRYPTED</span>
            </div>

            <div>
              <span className="text-xs font-mono-code text-white/50 uppercase">Primary Work Email</span>
              <div className="mt-2 flex items-center justify-between p-3 rounded-lg bg-[#0A0A0A] border border-white/10">
                <span className="font-mono-code text-sm sm:text-base text-white truncate mr-2">
                  {ABOUT_TEXT.email}
                </span>
                <button
                  onClick={handleCopyEmail}
                  className="p-2 rounded bg-white/5 hover:bg-[#FF5C00] hover:text-black transition-colors text-white/70"
                  aria-label="Copy email address"
                  title="Copy email"
                >
                  {copiedEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Terminal Command for Developers */}
            <div>
              <span className="text-xs font-mono-code text-white/50 uppercase">Developer CLI vCard</span>
              <div className="mt-2 flex items-center justify-between p-3 rounded-lg bg-[#0A0A0A] border border-white/10">
                <div className="flex items-center gap-2 font-mono-code text-xs text-[#FF5C00]">
                  <Terminal className="w-4 h-4 text-white/40" />
                  <span>npx vidson-card</span>
                </div>
                <button
                  onClick={handleCopyCommand}
                  className="p-2 rounded bg-white/5 hover:bg-[#FF5C00] hover:text-black transition-colors text-white/70"
                  aria-label="Copy terminal command"
                  title="Copy terminal command"
                >
                  {copiedCommand ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Timezone Status */}
            <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono-code text-white/50">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#FF5C00]" />
                <span>San Francisco, CA (PST)</span>
              </div>
              <span className="text-white/80">Online // Lead Intake</span>
            </div>
          </div>

          {/* Social Profiles Grid */}
          <div className="p-6 rounded-lg bg-[#141414] border border-white/[0.08]">
            <span className="block text-xs font-mono-code text-white/40 mb-4 uppercase">
              Network & Code Repositories
            </span>
            <div className="grid grid-cols-3 gap-3 font-mono-code text-xs">
              <a
                href="https://github.com/Vidson313"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded bg-[#0A0A0A] border border-white/5 hover:border-[#FF5C00]/50 hover:text-[#FF5C00] transition-colors flex items-center justify-center gap-2 text-white/80"
              >
                <Github className="w-4 h-4" />
                <span>@vidson313</span>
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded bg-[#0A0A0A] border border-white/5 hover:border-[#FF5C00]/50 hover:text-[#FF5C00] transition-colors flex items-center justify-center gap-2 text-white/80"
              >
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn</span>
              </a>

              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded bg-[#0A0A0A] border border-white/5 hover:border-[#FF5C00]/50 hover:text-[#FF5C00] transition-colors flex items-center justify-center gap-2 text-white/80"
              >
                <Twitter className="w-4 h-4" />
                <span>X // Twitter</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sub-Footer */}
      <div className="pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono-code text-white/50">
        <div>
          <span>© 2025 vidson.dev</span>
          <span className="mx-2">•</span>
          <span>Senior Full-Stack Architect</span>
        </div>

        <div className="flex items-center gap-6">
          <span className="text-[#FF5C00]">#0A0A0A // #FF5C00</span>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-white/70 hover:text-[#FF5C00] transition-colors cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5 text-[#FF5C00]" />
          </button>
        </div>
      </div>
    </footer>
  );
}
