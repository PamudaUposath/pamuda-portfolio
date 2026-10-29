// Experience Section - Timeline of work experience and leadership roles
import React, { useState } from "react";
import { Container, SectionHeader, Badge } from "../common";
import { experiences, type Experience as ExperienceType } from "../../data/experience";

type FilterCategory = "All" | "Work" | "Leadership" | "Volunteer";

const ITEMS_PER_PAGE = 5;

export const Experience: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedExperience, setSelectedExperience] = useState<ExperienceType | null>(null);
  const sectionRef = React.useRef<HTMLElement>(null);

  // Filter experiences based on selected category
  const filteredExperiences = activeFilter === "All"
    ? [...experiences].reverse()
    : experiences.filter((exp) => {
        if (activeFilter === "Work") return exp.type === "work";
        if (activeFilter === "Leadership") return exp.type === "leadership";
        if (activeFilter === "Volunteer") return exp.type === "volunteer";
        return true;
      }).reverse();

  // Calculate pagination
  const totalPages = Math.ceil(filteredExperiences.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentExperiences = filteredExperiences.slice(startIndex, endIndex);

  const categories: FilterCategory[] = ["All", "Work", "Leadership", "Volunteer"];

  // Reset to page 1 when filter changes
  const handleFilterChange = (category: FilterCategory) => {
    setActiveFilter(category);
    setCurrentPage(1);
  };

  // Handle page change without scrolling
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    if (sectionRef.current) {
      const sectionTop = sectionRef.current.offsetTop - 100;
      window.scrollTo({ top: sectionTop, behavior: 'smooth' });
    }
  };

  return (
    <section id="experience" ref={sectionRef} className="py-20 bg-lightbg">
      <Container>
        <SectionHeader
          title="Experience & Leadership"
          subtitle="My journey through professional work, leadership roles, and community contributions."
        />

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleFilterChange(category)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                activeFilter === category
                  ? "bg-primary text-white shadow-lg scale-105"
                  : "bg-white text-dark hover:bg-gray-100"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-primary/30 hidden md:block"></div>

            {/* Experience Items */}
            <div className="space-y-12">
              {currentExperiences.map((exp, index) => (
                <ExperienceItem 
                  key={exp.id} 
                  experience={exp} 
                  index={index}
                  onClick={() => setSelectedExperience(exp)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* No experiences message */}
        {filteredExperiences.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No experiences found in this category.
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-12">
            <button
              onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-primary text-white hover:bg-orange-600 shadow-lg hover:scale-105"
              }`}
            >
              ← Previous
            </button>
            
            <span className="text-dark font-medium">
              Page {currentPage} of {totalPages}
            </span>
            
            <button
              onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-primary text-white hover:bg-orange-600 shadow-lg hover:scale-105"
              }`}
            >
              Next →
            </button>
          </div>
        )}
      </Container>

      {/* Detail Modal */}
      {selectedExperience && (
        <ExperienceDetailModal
          experience={selectedExperience}
          onClose={() => setSelectedExperience(null)}
        />
      )}
    </section>
  );
};

// Individual Experience Item Component
const ExperienceItem: React.FC<{ 
  experience: ExperienceType; 
  index: number;
  onClick: () => void;
}> = ({ experience, onClick }) => {
  return (
    <div className="relative pl-0 md:pl-20">
      {/* Timeline dot */}
      <div className="absolute left-6 top-0 w-4 h-4 bg-primary rounded-full border-4 border-white shadow-lg hidden md:block"></div>

      {/* Content Card */}
      <div 
        className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.02]"
        onClick={onClick}
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-dark mb-1">
              {experience.role}
            </h3>
            <p className="text-primary font-semibold">
              {experience.organization}
            </p>
            {experience.location && (
              <p className="text-gray-600 text-sm mt-1">
                📍 {experience.location}
              </p>
            )}
          </div>

          {/* Date badge */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary">
              {experience.endDate ? `${experience.startDate} - ${experience.endDate}` : experience.startDate}
            </Badge>
            {experience.type && (
              <Badge 
                variant={experience.type === "volunteer" ? "primary" : "secondary"} 
                size="sm"
              >
                {experience.type}
              </Badge>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-3">{experience.description}</p>

        {/* View More Button */}
        <button className="inline-flex items-center gap-2 text-primary hover:text-orange-600 font-medium text-sm transition-colors">
          <span>View Details</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

// Experience Detail Modal Component
const ExperienceDetailModal: React.FC<{
  experience: ExperienceType;
  onClose: () => void;
}> = ({ experience, onClose }) => {
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
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
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
                {experience.role}
              </h2>
              {experience.type && (
                <Badge 
                  variant={experience.type === "volunteer" ? "primary" : "secondary"}
                  size="lg"
                >
                  {experience.type}
                </Badge>
              )}
            </div>
            
            <p className="text-xl text-primary font-semibold mb-2">
              {experience.organization}
            </p>
            
            <div className="flex flex-wrap items-center gap-4 text-gray-600">
              {experience.location && (
                <span className="flex items-center gap-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {experience.location}
                </span>
              )}
              <span className="flex items-center gap-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {experience.endDate ? `${experience.startDate} - ${experience.endDate}` : experience.startDate}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-dark mb-3">About the Role</h3>
            <p className="text-gray-700 leading-relaxed">{experience.description}</p>
          </div>

          {/* Highlights */}
          {experience.highlights && experience.highlights.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-dark mb-4">Key Highlights & Achievements</h3>
              <ul className="space-y-3">
                {experience.highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="text-gray-700 flex-1">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
