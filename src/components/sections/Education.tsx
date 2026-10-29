// Education Section - Academic background and qualifications
import React, { useState } from "react";
import { Container, SectionHeader, Card, Badge } from "../common";
import { educations, type Education as EducationType } from "../../data/education";
import { getAssetPath } from "../../utils/assets";

export const Education: React.FC = () => {
  const [selectedEducation, setSelectedEducation] = useState<EducationType | null>(null);

  return (
    <section id="education" className="py-20 bg-lightbg">
      <Container>
        <SectionHeader
          title="Education"
          subtitle="My academic journey and qualifications"
        />

        {/* Education Timeline */}
        <div className="space-y-8">
          {[...educations].reverse().map((edu, index) => (
            <EducationCard 
              key={edu.id} 
              education={edu} 
              index={index}
              onClick={() => setSelectedEducation(edu)}
            />
          ))}
        </div>

        {/* Education Detail Modal */}
        {selectedEducation && (
          <EducationModal 
            education={selectedEducation} 
            onClose={() => setSelectedEducation(null)} 
          />
        )}
      </Container>
    </section>
  );
};

// Individual Education Card Component
const EducationCard: React.FC<{ 
  education: EducationType; 
  index: number;
  onClick: () => void;
}> = ({ education, index, onClick }) => {
  const isOngoing = education.endDate === "Present";
  const hasActivities = education.activities && education.activities.length > 0;

  return (
    <Card 
      hover 
      className={`relative ${hasActivities ? 'cursor-pointer' : ''}`}
      onClick={hasActivities ? onClick : undefined}
    >
      {/* Timeline Connector Line */}
      {index !== educations.length - 1 && (
        <div className="absolute left-[47px] top-[100px] w-0.5 h-[calc(100%+32px)] bg-gray-300 -z-10"></div>
      )}

      <div className="flex gap-6">
        {/* Logo */}
        <div className="flex-shrink-0">
          <div className="w-20 h-20 rounded-full bg-white border-4 border-primary shadow-lg flex items-center justify-center overflow-hidden">
            {education.logo ? (
              <img
                src={getAssetPath(education.logo)}
                alt={`${education.institution} logo`}
                className="w-full h-full object-contain p-2"
                onError={(e) => {
                  // Fallback to initials if image doesn't exist
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    const initials = education.institution
                      .split(' ')
                      .map(word => word[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase();
                    parent.innerHTML = `<span class="text-primary font-bold text-xl">${initials}</span>`;
                  }
                }}
              />
            ) : (
              <span className="text-primary font-bold text-xl">
                {education.institution
                  .split(' ')
                  .map(word => word[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </span>
            )}
          </div>
        </div>

        {/* Education Details */}
        <div className="flex-1">
          {/* Header */}
          <div className="mb-3">
            <div className="flex items-start justify-between">
              <h3 className="text-2xl font-bold text-dark mb-1">
                {education.institution}
              </h3>
              {hasActivities && (
                <Badge variant="primary" size="sm">View Details</Badge>
              )}
            </div>
            <p className="text-lg font-semibold text-gray-700">
              {education.degree} {education.field}
            </p>
            <div className="flex items-center gap-3 mt-2">
              <p className="text-gray-600">
                {education.startDate} - {education.endDate}
              </p>
              {isOngoing && (
                <Badge variant="primary" size="sm">Currently Studying</Badge>
              )}
              {education.grade && (
                <Badge variant="dark" size="sm">{education.grade}</Badge>
              )}
            </div>
          </div>

          {/* Description */}
          {education.description && (
            <p className="text-gray-600 leading-relaxed">
              {education.description}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

// Education Detail Modal Component
const EducationModal: React.FC<{ 
  education: EducationType; 
  onClose: () => void;
}> = ({ education, onClose }) => {
  const isOngoing = education.endDate === "Present";

  // Close modal on escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

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

        {/* Header Section */}
        <div className="bg-gradient-to-r from-primary to-orange-600 text-white p-8 rounded-t-2xl">
          <div className="flex items-start gap-6">
            {/* Logo */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center overflow-hidden">
                {education.logo ? (
                  <img
                    src={getAssetPath(education.logo)}
                    alt={`${education.institution} logo`}
                    className="w-full h-full object-contain p-2"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        const initials = education.institution
                          .split(' ')
                          .map(word => word[0])
                          .join('')
                          .slice(0, 2)
                          .toUpperCase();
                        parent.innerHTML = `<span class="text-primary font-bold text-2xl">${initials}</span>`;
                      }
                    }}
                  />
                ) : (
                  <span className="text-primary font-bold text-2xl">
                    {education.institution
                      .split(' ')
                      .map(word => word[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()}
                  </span>
                )}
              </div>
            </div>

            {/* Institution Info */}
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-2">{education.institution}</h2>
              <p className="text-xl font-semibold mb-3">
                {education.degree} {education.field}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-white/90">
                  {education.startDate} - {education.endDate}
                </span>
                {isOngoing && (
                  <span className="px-3 py-1 bg-white text-primary rounded-full text-sm font-semibold">
                    Currently Studying
                  </span>
                )}
                {education.grade && (
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-semibold">
                    {education.grade}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8">
          {/* Description / Research Highlight */}
          {education.description && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-dark mb-3">About & Research Focus</h3>
              <p className="text-gray-600 leading-relaxed">{education.description}</p>
            </div>
          )}

          {/* Key Technical Focus / Skills */}
          {education.skills && education.skills.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-dark mb-3">Core Areas & Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {education.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-primary/10 text-primary font-medium text-sm rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Activities - Full List */}
          {education.activities && education.activities.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-dark mb-3">
                Activities and Leadership Roles
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {education.activities.map((activity, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-primary font-bold mt-1">•</span>
                    <span className="text-gray-700 text-sm flex-1">{activity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
