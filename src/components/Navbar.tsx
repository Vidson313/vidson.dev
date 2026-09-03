import { useState, useEffect, MouseEvent } from 'react';
import { Menu, X, ArrowUpRight, Terminal } from 'lucide-react';

interface NavbarProps {
  onOpenHireModal?: () => void;
}

export default function Navbar({ onOpenHireModal }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setIsScrolled(currentScroll > 20);

      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((currentScroll / totalHeight) * 100);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Work', href: '#projects', num: '01' },
    { label: 'Skills', href: '#skills', num: '02' },
    { label: 'About', href: '#about', num: '03' },
    { label: 'Contact', href: '#contact', num: '04' },
  ];

  const handleNavClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Top Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-[2px] z-50 bg-white/5 pointer-events-none">
        <div
          className="h-full bg-[#FF5C00] transition-all duration-100 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Main Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#0A0A0A]/90 backdrop-blur-md border-b border-white/[0.08] py-3.5'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#"
            className="group flex items-center gap-2 text-lg sm:text-xl font-mono-code font-bold tracking-tight text-white hover:opacity-90 transition-opacity"
            aria-label="vidson.dev home"
          >
            <div className="w-2.5 h-2.5 bg-[#FF5C00] rounded-sm group-hover:rotate-45 transition-transform duration-300" />
            <span>
              vidson<span className="text-[#FF5C00]">.dev</span>
            </span>
            <span className="hidden sm:inline-block ml-1 text-xs text-white/40 font-mono-code font-normal">
              v2.5
            </span>
          </a>

          {/* Availability Status - Desktop */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-[#141414] border border-white/[0.08] text-xs font-mono-code text-white/80">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF5C00] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF5C00]"></span>
            </span>
            <span>Available for Q3/Q4 contracts</span>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-mono-code">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="group relative text-white/60 hover:text-white transition-colors duration-200 py-1"
              >
                <span className="text-[#FF5C00]/70 mr-1 text-xs">{link.num}/</span>
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#FF5C00] group-hover:w-full transition-all duration-200" />
              </a>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-4">
            <a
              href="#contact"
              onClick={(e) => {
                if (onOpenHireModal) {
                  e.preventDefault();
                  onOpenHireModal();
                } else {
                  handleNavClick(e, '#contact');
                }
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FF5C00] text-black font-semibold text-xs tracking-wider uppercase rounded-lg hover:bg-[#ff7526] active:scale-95 transition-all duration-200 shadow-lg shadow-[#FF5C00]/20"
            >
              <span>Hire Me</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-white/80 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#FF5C00] rounded-lg bg-[#141414] border border-white/10"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Fullscreen Animated Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-[#0A0A0A]/98 backdrop-blur-xl md:hidden flex flex-col justify-between px-8 py-24 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2 pb-4 border-b border-white/10 font-mono-code text-xs text-white/40">
              <Terminal className="w-4 h-4 text-[#FF5C00]" />
              <span>NAVIGATION // DIRECTORY</span>
            </div>

            <nav className="flex flex-col gap-6 mt-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="flex items-center justify-between text-2xl font-grotesk font-bold text-white hover:text-[#FF5C00] transition-colors py-2 border-b border-white/5"
                >
                  <span className="flex items-center gap-3">
                    <span className="font-mono-code text-sm text-[#FF5C00]">{link.num}.</span>
                    <span>{link.label}</span>
                  </span>
                  <ArrowUpRight className="w-5 h-5 opacity-60" />
                </a>
              ))}
            </nav>
          </div>

          <div className="flex flex-col gap-4 pt-6 border-t border-white/10">
            <div className="flex items-center gap-2 text-xs font-mono-code text-white/70">
              <span className="w-2 h-2 rounded-full bg-[#FF5C00] animate-pulse" />
              <span>Available for projects & advisory</span>
            </div>

            <a
              href="#contact"
              onClick={(e) => {
                setMobileMenuOpen(false);
                if (onOpenHireModal) {
                  e.preventDefault();
                  onOpenHireModal();
                } else {
                  handleNavClick(e, '#contact');
                }
              }}
              className="w-full text-center py-3.5 bg-[#FF5C00] text-black font-bold uppercase tracking-wider text-sm rounded-lg"
            >
              Hire Me // Let's Talk
            </a>
          </div>
        </div>
      )}
    </>
  );
}
