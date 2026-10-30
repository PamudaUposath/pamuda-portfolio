// Navbar Component - Responsive navigation with smooth scrolling
import React, { useState } from "react";
import { Container } from "../common";
import { siteConfig } from "../../data/siteConfig";

interface NavbarProps {
  onSwitchTo3D?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSwitchTo3D }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when clicking a link
  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { href: "#home", label: "Home" },
    { href: "#projects", label: "Projects" },
    { href: "#experience", label: "Experience" },
    { href: "#education", label: "Education" },
    { href: "#opensource", label: "Open Source" },
    { href: "#achievements", label: "Achievements" },
    { href: "#certifications", label: "Certifications" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm py-3 border-b border-gray-100 transition-all duration-300">
      <Container className="max-w-[92%] !px-4 sm:!px-6">
        <div className="flex items-center justify-between">
          {/* Logo/Name */}
          <a
            href="#home"
            className="text-2xl font-black text-dark hover:text-primary transition-colors tracking-tight shrink-0"
            onClick={(e) => {
              e.preventDefault();
              window.location.reload();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            {siteConfig.name.split(" ")[0]}
            <span className="text-primary">.</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8 mx-auto">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-slate-700 hover:text-primary font-medium text-sm transition-colors relative group py-1 whitespace-nowrap"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
              </a>
            ))}
          </div>

          {/* Action Buttons (Desktop): "Let's Talk" and "3D World" with equal width & height */}
          <div className="hidden lg:flex items-center gap-3.5 shrink-0">
            <a
              href="#contact"
              className="w-[136px] h-10 inline-flex items-center justify-center rounded-xl bg-primary text-white text-sm font-bold shadow-md shadow-orange-500/20 hover:bg-orange-600 hover:shadow-orange-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Let's Talk
            </a>

            {onSwitchTo3D && (
              <button
                onClick={onSwitchTo3D}
                className="w-[136px] h-10 relative inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 text-white text-sm font-bold shadow-md shadow-sky-500/25 hover:shadow-sky-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all ring-2 ring-sky-400/80"
                title="Enter Pamuda's 3D Cloud World"
              >
                <span className="text-sm">🌍</span>
                <span className="tracking-wide">3D World</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
              </button>
            )}
          </div>

          {/* Mobile Right Controls: 3D World Button + Hamburger Menu */}
          <div className="lg:hidden flex items-center gap-2 shrink-0">
            {onSwitchTo3D && (
              <button
                onClick={onSwitchTo3D}
                className="h-9 px-3 relative inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 text-white text-xs font-bold shadow-md shadow-sky-500/25 hover:shadow-sky-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all ring-2 ring-sky-400/80"
                title="Enter Pamuda's 3D Cloud World"
                aria-label="Enter 3D World"
              >
                <span className="text-xs">🌍</span>
                <span className="tracking-wide">3D World</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              className="w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-xl hover:bg-slate-100 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <span
                className={`w-5 h-0.5 bg-dark transition-all ${
                  isMobileMenuOpen ? "rotate-45 translate-y-2" : ""
                }`}
              ></span>
              <span
                className={`w-5 h-0.5 bg-dark transition-all ${
                  isMobileMenuOpen ? "opacity-0" : ""
                }`}
              ></span>
              <span
                className={`w-5 h-0.5 bg-dark transition-all ${
                  isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              ></span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            isMobileMenuOpen ? "max-h-96 mt-6" : "max-h-0"
          }`}
        >
          <div className="flex flex-col gap-4 pb-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={handleNavClick}
                className="text-dark hover:text-primary font-medium transition-colors py-2"
              >
                {link.label}
              </a>
            ))}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href="#contact"
                onClick={handleNavClick}
                className="w-full sm:w-1/2 h-11 inline-flex items-center justify-center rounded-xl bg-primary text-white font-bold text-sm shadow-md hover:bg-orange-600 transition-all"
              >
                Let's Talk
              </a>
              {onSwitchTo3D && (
                <button
                  onClick={() => {
                    handleNavClick();
                    onSwitchTo3D();
                  }}
                  className="w-full sm:w-1/2 h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 text-white font-bold text-sm shadow-md ring-2 ring-sky-400 transition-all"
                >
                  <span>🌍 Explore 3D World</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                </button>
              )}
            </div>
          </div>
        </div>
      </Container>
    </nav>
  );
};
