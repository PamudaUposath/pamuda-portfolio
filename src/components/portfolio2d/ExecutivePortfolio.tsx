import React from 'react';
import {
  Navbar,
  Hero,
  Projects,
  Experience,
  Education,
  OpenSource,
  Skills,
  Achievements,
  Certifications,
  Contact,
  Footer,
} from '../sections';
import { ScrollToTop } from '../common';

interface ExecutivePortfolioProps {
  onSwitchTo3D: () => void;
  onOpenJourney?: () => void;
  onOpenCV?: () => void;
  onOpenJournal?: () => void;
  onOpenSkillsConsole?: () => void;
}

export const ExecutivePortfolio: React.FC<ExecutivePortfolioProps> = ({
  onSwitchTo3D,
}) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-white text-dark select-auto scroll-smooth">
      {/* Navigation with seamless 3D World switch */}
      <Navbar onSwitchTo3D={onSwitchTo3D} />

      {/* Main Content Sections from pamudauposath-portfolio */}
      <main>
        <Hero />
        <Projects />
        <Experience />
        <Education />
        <OpenSource />
        <Achievements />
        <Certifications />
        <Skills />
        <Contact />
      </main>

      {/* Footer */}
      <Footer />

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
};
