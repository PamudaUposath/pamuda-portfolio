// Open Source Contributions Section
import React, { useState } from "react";
import { Container, SectionHeader, Card, Badge } from "../common";
import { openSourceContributions, type OpenSourceContribution } from "../../data/openSource";

export const OpenSource: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedContribution, setSelectedContribution] = useState<OpenSourceContribution | null>(null);

  const ITEMS_PER_VIEW = 3; // Show 3 contributions at a time

  const handlePrevious = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? openSourceContributions.length - ITEMS_PER_VIEW : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) => 
      prev >= openSourceContributions.length - ITEMS_PER_VIEW ? 0 : prev + 1
    );
  };

  const reversedContributions = [...openSourceContributions].reverse();
  const visibleContributions = reversedContributions.slice(currentIndex, currentIndex + ITEMS_PER_VIEW);

  return (
    <section id="opensource" className="py-20 bg-lightbg">
      <Container>
        <SectionHeader
          title="Open Source Contributions"
          subtitle="Contributing to the global developer community through open source projects."
        />

        {/* Carousel Container */}
        <div className="relative">
          {/* Left Arrow */}
          {openSourceContributions.length > ITEMS_PER_VIEW && (
            <button
              onClick={handlePrevious}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 bg-white text-primary hover:bg-primary hover:text-white hover:scale-110"
              aria-label="Previous contributions"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Contributions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
            {visibleContributions.map((contribution) => (
              <ContributionCard 
                key={contribution.id} 
                contribution={contribution}
                onClick={() => setSelectedContribution(contribution)}
              />
            ))}
          </div>

          {/* Right Arrow */}
          {openSourceContributions.length > ITEMS_PER_VIEW && (
            <button
              onClick={handleNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 bg-white text-primary hover:bg-primary hover:text-white hover:scale-110"
              aria-label="Next contributions"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>

        {/* Carousel Indicators */}
        {openSourceContributions.length > ITEMS_PER_VIEW && (
          <div className="flex justify-center items-center gap-2 mt-8">
            {Array.from({ length: openSourceContributions.length - ITEMS_PER_VIEW + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentIndex === index
                    ? "w-8 bg-primary"
                    : "w-2 bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </Container>

      {/* Detail Modal */}
      {selectedContribution && (
        <ContributionDetailModal
          contribution={selectedContribution}
          onClose={() => setSelectedContribution(null)}
        />
      )}
    </section>
  );
};

// Individual Contribution Card Component (Compact)
const ContributionCard: React.FC<{ 
  contribution: OpenSourceContribution;
  onClick: () => void;
}> = ({ contribution, onClick }) => {
  return (
    <Card 
      hover 
      className="h-full flex flex-col cursor-pointer hover:scale-105 transition-transform duration-300"
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-xl font-bold text-dark">
              {contribution.projectName}
            </h3>
            {contribution.status === "active" && (
              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                Active
              </span>
            )}
          </div>
          <p className="text-primary font-semibold text-sm">
            {contribution.organization}
          </p>
        </div>

        {/* GitHub Stars */}
        {contribution.stars && (
          <div className="flex items-center gap-1 text-gray-600">
            <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="font-semibold text-sm">
              {contribution.stars >= 1000 
                ? `${(contribution.stars / 1000).toFixed(0)}k` 
                : contribution.stars}
            </span>
          </div>
        )}
      </div>

      {/* Role & Date */}
      <p className="text-xs text-gray-600 mb-3">
        {contribution.role} • {contribution.startDate}
        {contribution.endDate ? ` - ${contribution.endDate}` : " - Present"}
      </p>

      {/* Short Description */}
      <p className="text-gray-600 text-sm flex-1">
        {contribution.shortDescription}
      </p>

      {/* View More Indicator */}
      <div className="mt-4 pt-3 border-t border-gray-100">
        <span className="text-primary hover:text-orange-600 font-medium text-sm inline-flex items-center gap-1">
          View Details
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </Card>
  );
};

// Contribution Detail Modal Component
const ContributionDetailModal: React.FC<{
  contribution: OpenSourceContribution;
  onClose: () => void;
}> = ({ contribution, onClose }) => {
  // Close on escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors z-10"
          aria-label="Close"
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="p-8">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-start gap-3 mb-4">
              <h2 className="text-3xl font-bold text-dark flex-1">
                {contribution.projectName}
              </h2>
              {contribution.status === "active" && (
                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                  Active
                </span>
              )}
              {contribution.stars && (
                <div className="flex items-center gap-1 text-gray-600">
                  <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-semibold">
                    {contribution.stars >= 1000 
                      ? `${(contribution.stars / 1000).toFixed(1)}k` 
                      : contribution.stars}
                  </span>
                </div>
              )}
            </div>
            
            <p className="text-xl text-primary font-semibold mb-2">
              {contribution.organization}
            </p>
            
            <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
              <span className="flex items-center gap-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {contribution.role}
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {contribution.startDate}
                {contribution.endDate ? ` - ${contribution.endDate}` : " - Present"}
              </span>
            </div>

            {/* Tech Stack */}
            <div className="flex flex-wrap gap-2">
              {contribution.tech.map((tech, idx) => (
                <Badge key={idx} variant="outline" size="sm">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-dark mb-3">About the Project</h3>
            <p className="text-gray-700 leading-relaxed">{contribution.description}</p>
          </div>

          {/* Contributions */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-dark mb-4">My Contributions</h3>
            <ul className="space-y-3">
              {contribution.contributions.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-gray-700 flex-1">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div className="flex gap-4 pt-6 border-t border-gray-100">
            <a
              href={contribution.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-dark text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              View on GitHub
            </a>
            {contribution.websiteUrl && (
              <a
                href={contribution.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                Visit Website
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
