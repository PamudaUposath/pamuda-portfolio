// Projects Section - Filterable project showcase
import React, { useState } from "react";
import { Container, SectionHeader, Card, Badge } from "../common";
import { projects, type Project } from "../../data/projects";
import { getAssetPath } from "../../utils/assets";

type FilterCategory = "Mobile" | "Web" | "Cloud" | "IoT";
type FilterType = "Team" | "Individual" | "Open Source";

const ITEMS_PER_PAGE = 6;

export const Projects: React.FC = () => {
  const [selectedCategories, setSelectedCategories] = useState<FilterCategory[]>([]);
  const [selectedType, setSelectedType] = useState<FilterType | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const sectionRef = React.useRef<HTMLElement>(null);

  // Helper to parse dates like "Aug 2026", "Present", "2026" for chronological sorting
  const getProjectTimestamp = (project: Project): number => {
    const dateStr = project.endDate || project.startDate || "";
    if (dateStr.toLowerCase() === "present") {
      return new Date("2026-12-31").getTime();
    }
    const parsed = Date.parse(dateStr.length === 4 ? `Jan 1, ${dateStr}` : `1 ${dateStr}`);
    return isNaN(parsed) ? 0 : parsed;
  };

  // Filter and sort projects: Featured projects first, then descending chronological order (newest to oldest)
  const filteredProjects = projects
    .filter((project) => {
      const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(project.category as FilterCategory);
      const typeMatch = selectedType === null || project.projectType === selectedType;
      return categoryMatch && typeMatch;
    })
    .sort((a, b) => {
      // 1. Featured projects come first
      if (a.highlight && !b.highlight) return -1;
      if (!a.highlight && b.highlight) return 1;
      // 2. Descending by end date/timestamp (newest first)
      const diff = getProjectTimestamp(b) - getProjectTimestamp(a);
      if (diff !== 0) return diff;
      // 3. Fallback descending by ID
      return parseInt(b.id, 10) - parseInt(a.id, 10);
    });

  // Calculate pagination
  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProjects = filteredProjects.slice(startIndex, endIndex);

  // Get unique categories and types for filter buttons
  const categories: FilterCategory[] = ["Mobile", "Web", "Cloud", "IoT"];
  const projectTypes: FilterType[] = ["Team", "Individual", "Open Source"];

  // Toggle category filter
  const toggleCategory = (category: FilterCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
    setCurrentPage(1);
  };

  // Set single type filter
  const selectType = (type: FilterType) => {
    setSelectedType((prev) => prev === type ? null : type);
    setCurrentPage(1);
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedType(null);
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
    <section id="projects" ref={sectionRef} className="py-20 bg-white">
      <Container>
        <SectionHeader
          title="Featured Projects"
          subtitle="A collection of projects showcasing my skills in mobile development, cloud computing, IoT, and web applications."
        />

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {/* Project Type Filters */}
          {projectTypes.map((type) => (
            <button
              key={type}
              onClick={() => selectType(type)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                selectedType === type
                  ? "bg-primary text-white shadow-lg scale-105"
                  : "bg-lightbg text-dark hover:bg-gray-200"
              }`}
            >
              {type}
            </button>
          ))}
          
          {/* Divider */}
          <div className="w-px bg-gray-300 self-stretch mx-2"></div>
          
          {/* Category Filters */}
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => toggleCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                selectedCategories.includes(category)
                  ? "bg-primary text-white shadow-lg scale-105"
                  : "bg-lightbg text-dark hover:bg-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
          
          {/* Clear All Button */}
          {(selectedCategories.length > 0 || selectedType !== null) && (
            <>
              <div className="w-px bg-gray-300 self-stretch mx-2"></div>
              <button
                onClick={clearFilters}
                className="px-6 py-2 rounded-full font-medium transition-all duration-300 bg-gray-800 text-white hover:bg-gray-700"
              >
                Clear All ({filteredProjects.length})
              </button>
            </>
          )}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentProjects.map((project) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              onClick={() => setSelectedProject(project)}
            />
          ))}
        </div>
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

        {/* Project Detail Modal */}
        {selectedProject && (
          <ProjectModal 
            project={selectedProject} 
            onClose={() => setSelectedProject(null)} 
          />
        )}
      </Container>
    </section>
  );
};

// Individual Project Card Component
const ProjectCard: React.FC<{ 
  project: Project; 
  onClick: () => void;
}> = ({ project, onClick }) => {
  return (
    <Card hover className="flex flex-col h-full cursor-pointer" onClick={onClick}>
      {/* Project Image */}
      <div className="relative h-48 -m-6 mb-4 overflow-hidden rounded-t-xl">
        <img
          src={getAssetPath(project.image)}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          onError={(e) => {
            // Fallback to placeholder if image doesn't exist
            e.currentTarget.src = `https://via.placeholder.com/400x300/ff7300/ffffff?text=${encodeURIComponent(project.title)}`;
          }}
        />
        {/* Highlight badge */}
        {project.highlight && (
          <div className="absolute top-4 right-4">
            <Badge variant="dark">⭐ Featured</Badge>
          </div>
        )}
        {project.ongoing && (
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-white text-green-600 border border-green-500 rounded-full font-semibold text-xs shadow">Ongoing</span>
          </div>
        )}
      </div>

      {/* Project Details */}
      <div className="flex-1 flex flex-col relative">
        {/* Title and Project Type Badge */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-bold text-dark flex-1">{project.title}</h3>
          <Badge variant={project.projectType === "Team" ? "primary" : "dark"} size="sm">
            {project.projectType}
          </Badge>
        </div>

        {/* Duration */}
        <p className="text-sm text-gray-500 mb-2">
          {project.startDate} - {project.endDate}
        </p>

        {/* Description */}
        <p className="text-gray-600 mb-4 flex-1">{project.shortDescription}</p>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tech.map((tech) => (
            <Badge key={tech} variant="primary" size="sm">
              {tech}
            </Badge>
          ))}
        </div>

        {/* Links */}
        <div className="flex gap-3 justify-between items-end">
          <div className="flex gap-3">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 text-dark hover:text-primary transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span className="text-sm font-medium">Code</span>
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 text-dark hover:text-primary transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                <span className="text-sm font-medium">
                  {project.liveUrl.includes("play.google.com") ? "Google Play" : "Live Demo"}
                </span>
              </a>
            )}
          </div>

          {/* LinkedIn More Info - Bottom Right Corner */}
          {project.linkedinProjectUrl && (
            <a
              href={project.linkedinProjectUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2 text-dark hover:text-primary transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
              <span className="text-sm font-medium">More Info</span>
            </a>
          )}
        </div>
      </div>
    </Card>
  );
};

// Project Detail Modal Component
const ProjectModal: React.FC<{ 
  project: Project; 
  onClose: () => void;
}> = ({ project, onClose }) => {
  const [currentMediaIndex, setCurrentMediaIndex] = React.useState(0);
  
  // Combine main image with gallery items, using getAssetPath for all images/videos
  const allMedia = [
    { url: getAssetPath(project.image), type: "image" as const },
    ...((project.gallery || []).map(item => ({
      ...item,
      url: item.type === "image" ? getAssetPath(item.url) : item.url
    })))]

  // Close modal on escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const nextMedia = () => {
    setCurrentMediaIndex((prev) => (prev + 1) % allMedia.length);
  };

  const prevMedia = () => {
    setCurrentMediaIndex((prev) => (prev - 1 + allMedia.length) % allMedia.length);
  };

  const currentMedia = allMedia[currentMediaIndex];

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors z-10"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Project Image/Video Gallery */}
        <div className="relative h-64 md:h-96 overflow-hidden rounded-t-2xl bg-gray-100">
          {currentMedia.type === "video" ? (
            <video
              src={currentMedia.url}
              controls
              className="w-full h-full object-contain"
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              src={currentMedia.url}
              alt={`${project.title} - Image ${currentMediaIndex + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = `https://via.placeholder.com/800x400/ff7300/ffffff?text=${encodeURIComponent(project.title)}`;
              }}
            />
          )}
          
          {project.highlight && (
            <div className="absolute top-4 left-4">
              <Badge variant="dark">⭐ Featured</Badge>
            </div>
          )}
          {project.ongoing && (
            <div className="absolute top-4 right-4">
              <span className="px-4 py-2 bg-white text-green-600 border border-green-500 rounded-full font-semibold text-sm shadow">Ongoing</span>
            </div>
          )}

          {/* Navigation Arrows (show only if multiple media) */}
          {allMedia.length > 1 && (
            <>
              <button
                onClick={prevMedia}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-colors shadow-lg"
                aria-label="Previous media"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextMedia}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-colors shadow-lg"
                aria-label="Next media"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Media Indicator Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {allMedia.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentMediaIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentMediaIndex 
                        ? "bg-white w-8" 
                        : "bg-white/50 hover:bg-white/75"
                    }`}
                    aria-label={`Go to media ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Project Content */}
        <div className="p-8">
          {/* Title, Category, and Project Type */}
          <div className="mb-4">
            <h2 className="text-3xl font-bold text-dark mb-3">{project.title}</h2>
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge variant="primary">{project.category}</Badge>
              <Badge variant={project.projectType === "Team" ? "primary" : "dark"}>
                {project.projectType} Project
              </Badge>
            </div>
            <p className="text-gray-600">
              {project.startDate} - {project.endDate}
            </p>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-dark mb-2">About This Project</h3>
            <p className="text-gray-600 leading-relaxed">{project.description}</p>
          </div>

          {/* Tech Stack */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-dark mb-3">Technologies Used</h3>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((tech) => (
                <Badge key={tech} variant="primary" size="sm">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>

          {/* Project Participants */}
          {project.participants && project.participants.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-dark mb-3">Team Members</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {project.participants.map((participant, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    {/* Avatar Placeholder */}
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-semibold flex-shrink-0">
                      {participant.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    
                    {/* Name and LinkedIn */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-dark truncate">{participant.name}</p>
                      {participant.linkedinUrl && (
                        <a
                          href={participant.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:text-orange-600 transition-colors inline-flex items-center gap-1"
                        >
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                          </svg>
                          View Profile
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          <div className="flex flex-wrap gap-4">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-dark text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                View Source Code
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                {project.liveUrl.includes("play.google.com") ? "View on Google Play" : "View Live Demo"}
              </a>
            )}
            {project.linkedinProjectUrl && (
              <a
                href={project.linkedinProjectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-[#0A66C2] text-white rounded-lg hover:bg-[#004182] transition-colors font-medium"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                View on LinkedIn
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
