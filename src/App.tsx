import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Projects from './components/Projects';
import GitHubActivity from './components/GitHubActivity';
import SkillsAbout from './components/SkillsAbout';
import ContactFooter from './components/ContactFooter';
import CvModal from './components/CvModal';
import CustomCursor from './components/CustomCursor';
import Toast from './components/Toast';

export default function App() {
  const [cvModalOpen, setCvModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleScrollToProjects = () => {
    const el = document.getElementById('projects');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0A0A0A] text-white selection:bg-[#FF5C00] selection:text-black font-body overflow-x-hidden">
      {/* Custom Desktop Interactive Cursor */}
      <CustomCursor />

      {/* Global Toast Notification */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      {/* Fixed Sticky Glass Navbar with Scroll Progress Bar */}
      <Navbar onOpenHireModal={handleScrollToContact} />

      {/* Main Single-Page Content */}
      <main>
        {/* Section 00: Hero with Word-by-Word Typing & Trust Badges */}
        <Hero
          onOpenCvModal={() => setCvModalOpen(true)}
          onViewWorkClick={handleScrollToProjects}
        />

        {/* Section 01: Selected Work Portfolio Grid with Case Study Deep-Dives */}
        <Projects />

        {/* Section 01.5: Real-Time GitHub Activity & Live Commit Telemetry (id: vidson313) */}
        <GitHubActivity />

        {/* Section 02: Skills & Experience Two-Column Layout with Career Timeline */}
        <SkillsAbout />

        {/* Section 03: Contact & Lead Generation with Interactive Project Scope Form */}
        <ContactFooter onShowToast={showToast} />
      </main>

      {/* CV / Resume Interactive Modal */}
      <CvModal
        isOpen={cvModalOpen}
        onClose={() => setCvModalOpen(false)}
        onShowToast={showToast}
      />
    </div>
  );
}
