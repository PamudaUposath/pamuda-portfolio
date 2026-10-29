// Section Header component - reusable for all sections
import React from "react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  align = "center",
}) => {
  const alignmentClass = align === "center" ? "text-center" : "text-left";

  return (
    <div className={`mb-12 ${alignmentClass}`}>
      <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
};
