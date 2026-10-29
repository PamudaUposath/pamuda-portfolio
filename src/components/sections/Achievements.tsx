// Achievements Section - Awards only
import React, { useState } from "react";
import { Container, SectionHeader, Card, Badge } from "../common";
import { achievements } from "../../data/achievements";

export const Achievements: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAward, setSelectedAward] = useState<typeof achievements[0] | null>(null);
  
  // Filter only awards
  const awards = achievements.filter((item) => item.category === "award").reverse();

  const ITEMS_PER_VIEW = 3; // Show 3 awards at a time
  const maxIndex = Math.max(0, awards.length - ITEMS_PER_VIEW);

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const visibleAwards = awards.slice(currentIndex, currentIndex + ITEMS_PER_VIEW);

  return (
    <section id="achievements" className="py-20 bg-lightbg">
      <Container>
        <SectionHeader
          title="Achievements & Awards"
          subtitle="Recognition and awards received for technical excellence, innovation, and competition wins."
        />

        {/* Carousel Container */}
        <div className="relative">
          {/* Left Arrow */}
          {awards.length > ITEMS_PER_VIEW && (
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
                currentIndex === 0
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white text-primary hover:bg-primary hover:text-white hover:scale-110"
              }`}
              aria-label="Previous awards"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Awards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
            {visibleAwards.map((award) => (
              <AwardCard 
                key={award.id} 
                award={award} 
                onViewDetails={() => setSelectedAward(award)}
              />
            ))}
          </div>

          {/* Right Arrow */}
          {awards.length > ITEMS_PER_VIEW && (
            <button
              onClick={handleNext}
              disabled={currentIndex >= maxIndex}
              className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
                currentIndex >= maxIndex
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white text-primary hover:bg-primary hover:text-white hover:scale-110"
              }`}
              aria-label="Next awards"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>

        {/* Carousel Indicators */}
        {awards.length > ITEMS_PER_VIEW && (
          <div className="flex justify-center items-center gap-2 mt-8">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
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

      {/* Award Details Modal */}
      {selectedAward && (
        <AwardModal 
          award={selectedAward} 
          onClose={() => setSelectedAward(null)} 
        />
      )}
    </section>
  );
};

// Individual Award Card
const AwardCard: React.FC<{ 
  award: typeof achievements[0]; 
  onViewDetails: () => void;
}> = ({ award, onViewDetails }) => {
  return (
    <Card hover className="h-full flex flex-col cursor-pointer" onClick={onViewDetails}>
      {/* Icon/Badge */}
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
          <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        </div>
        
        {/* Category Badge */}
        <Badge variant="primary" size="sm">
          🏆 Award
        </Badge>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        {/* Title */}
        <h3 className="text-lg font-bold text-dark mb-2">
          {award.title}
        </h3>

        {/* Issuer */}
        <p className="text-primary font-semibold mb-2">
          {award.issuer}
        </p>

        {/* Date */}
        <p className="text-gray-500 text-sm mb-3">
          📅 {award.date}
        </p>

        {/* Description */}
        {award.description && (
          <p className="text-gray-600 text-sm mb-4 flex-1">
            {award.description}
          </p>
        )}

        {/* View Details Link - Centered */}
        <div className="flex justify-center mt-auto">
          <span className="flex items-center gap-2 text-primary hover:text-orange-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium">View Details</span>
          </span>
        </div>
      </div>
    </Card>
  );
};

// Award Details Modal
const AwardModal: React.FC<{
  award: typeof achievements[0];
  onClose: () => void;
}> = ({ award, onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-primary to-orange-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                <span className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">
                  🏆 Award
                </span>
              </div>
              <h2 className="text-2xl font-bold mb-2">{award.title}</h2>
              <p className="text-white/90 text-lg font-medium">{award.issuer}</p>
              <p className="text-white/80 text-sm mt-1">📅 {award.date}</p>
            </div>
            <button
              onClick={onClose}
              className="ml-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Detailed Description */}
          {award.detailedDescription && (
            <div>
              <h3 className="text-lg font-bold text-dark mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                About This Award
              </h3>
              <p className="text-gray-700 leading-relaxed">{award.detailedDescription}</p>
            </div>
          )}

          {/* Key Achievements */}
          {award.achievements && award.achievements.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-dark mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                Key Achievements
              </h3>
              <ul className="space-y-2">
                {award.achievements.map((achievement, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm mt-0.5">
                      ✓
                    </span>
                    <span className="text-gray-700 flex-1">{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Team Members */}
          {award.teamMembers && award.teamMembers.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-dark mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Team
              </h3>
              <div className="flex flex-wrap gap-2">
                {award.teamMembers.map((member, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-primary/10 text-primary rounded-full font-medium text-sm"
                  >
                    {member}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* LinkedIn Link */}
          {award.linkedInPost && (
            <div className="pt-4 border-t border-gray-200">
              <a
                href={award.linkedInPost}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-[#0A66C2] hover:bg-[#004182] text-white rounded-lg font-medium transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                <span>View Post on LinkedIn</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
