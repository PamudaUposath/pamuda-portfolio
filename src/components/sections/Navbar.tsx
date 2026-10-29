// Navbar Component - Responsive navigation with smooth scrolling
import React, { useState, useEffect } from "react";
import { Container } from "../common";
import { siteConfig } from "../../data/siteConfig";

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    { href: "#skills", label: "Skills" },
    { href: "#achievements", label: "Achievements" },
    { href: "#certifications", label: "Certifications" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white shadow-lg py-4"
          : "bg-transparent py-6"
      }`}
    >
      <Container className="max-w-[90%] !px-4 sm:!px-6 lg:!pr-4">
        <div className="flex items-center justify-between">
          {/* Logo/Name */}
          <a
            href="#home"
            className="text-2xl font-bold text-dark hover:text-primary transition-colors"
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
          <div className="hidden xl:flex items-right gap-8 ml-auto">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-dark hover:text-primary font-medium transition-colors relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
              </a>
            ))}
          </div>

          {/* CTA Button (Desktop) */}
          <a
            href="#contact"
            className="hidden xl:inline-flex items-center px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-orange-600 transition-all hover:scale-105 ml-6"
          >
            Let's Talk
          </a>

          {/* Mobile Menu Button */}
          <button
            className="xl:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`w-6 h-0.5 bg-dark transition-all ${
                isMobileMenuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            ></span>
            <span
              className={`w-6 h-0.5 bg-dark transition-all ${
                isMobileMenuOpen ? "opacity-0" : ""
              }`}
            ></span>
            <span
              className={`w-6 h-0.5 bg-dark transition-all ${
                isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            ></span>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`xl:hidden overflow-hidden transition-all duration-300 ${
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
            <a
              href="#contact"
              onClick={handleNavClick}
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-orange-600 transition-all"
            >
              Let's Talk
            </a>
          </div>
        </div>
      </Container>
    </nav>
  );
};
