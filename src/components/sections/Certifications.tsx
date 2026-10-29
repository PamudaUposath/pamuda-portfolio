// Certifications Section
import React, { useState } from "react";
import { Container, SectionHeader, Card, Badge } from "../common";
import { achievements } from "../../data/achievements";

type FilterCategory = "All" | "Certification" | "Publication";

const ITEMS_PER_PAGE = 6;

export const Certifications: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const sectionRef = React.useRef<HTMLElement>(null);

  // Get all certifications and publications
  const allItems = achievements.filter(
    (item) => item.category === "certification" || item.category === "publication"
  ).reverse();

  // Filter based on selected category
  const filteredItems = activeFilter === "All"
    ? allItems
    : allItems.filter((item) => {
        if (activeFilter === "Certification") return item.category === "certification";
        if (activeFilter === "Publication") return item.category === "publication";
        return true;
      });

  // Calculate pagination
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = filteredItems.slice(startIndex, endIndex);

  const categories: FilterCategory[] = ["All", "Certification", "Publication"];

  // Reset to page 1 when filter changes
  const handleFilterChange = (category: FilterCategory) => {
    setActiveFilter(category);
    setCurrentPage(1);
  };

  // Handle page change without scrolling
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    // Prevent page scroll by staying at section top
    if (sectionRef.current) {
      const sectionTop = sectionRef.current.offsetTop - 100; // 100px offset for navbar
      window.scrollTo({ top: sectionTop, behavior: 'smooth' });
    }
  };

  return (
    <section id="certifications" ref={sectionRef} className="py-20 bg-white">
      <Container>
        <SectionHeader
          title="Certifications & Publications"
          subtitle="Professional certifications and published research demonstrating continuous learning and expertise."
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
                  : "bg-lightbg text-dark hover:bg-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentItems.map((cert) => (
            <CertificationCard key={cert.id} certification={cert} />
          ))}
        </div>

        {/* No items message */}
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No items found in this category.
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
    </section>
  );
};

// Individual Certification Card
const CertificationCard: React.FC<{ certification: typeof achievements[0] }> = ({ certification }) => {
  return (
    <Card className="h-full flex flex-col">
      {/* Icon/Badge */}
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
          {certification.category === "certification" && (
            <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          )}
          {certification.category === "publication" && (
            <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          )}
        </div>
        
        {/* Category Badge */}
        {certification.category && (
          <Badge variant="primary" size="sm">
            {certification.category}
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        {/* Title */}
        <h3 className="text-lg font-bold text-dark mb-2">
          {certification.title}
        </h3>

        {/* Issuer */}
        <p className="text-primary font-semibold mb-2">
          {certification.issuer}
        </p>

        {/* Date */}
        <p className="text-gray-500 text-sm mb-3">
          📅 {certification.date}
        </p>

        {/* Description */}
        {certification.description && (
          <p className="text-gray-600 text-sm mb-4 flex-1">
            {certification.description}
          </p>
        )}

        {/* Link - Different text for certifications vs publications */}
        {certification.link && (
          <div className="flex justify-center mt-auto">
            <a
              href={certification.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-2 text-primary hover:text-orange-600 font-medium text-sm transition-colors"
            >
              <span>
                {certification.category === "publication" ? "View Publication" : "View Certificate"}
              </span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        )}
      </div>
    </Card>
  );
};
