// Utility functions to calculate dynamic stats from data files
import { projects } from "../data/projects";
import { skills } from "../data/skills";

/**
 * Calculate total number of completed projects
 */
export const getProjectsCompletedCount = (): string => {
  const count = projects.length;
  return `${count}+`;
};

/**
 * Calculate years of experience starting from 2023
 * Only counts professional experience from 2023 onwards
 */
export const getYearsOfExperience = (): string => {
  const startYear = 2023; // Professional experience start year
  const currentDate = new Date();
  const yearsDiff = currentDate.getFullYear() - startYear;
  
  // Return years with + suffix
  return `${yearsDiff}+`;
};

/**
 * Get all unique technologies from projects
 */
export const getTechStack = (): string[] => {
  const techSet = new Set<string>();
  
  projects.forEach(project => {
    project.tech.forEach(tech => techSet.add(tech));
  });
  
  // Convert to array and sort alphabetically
  return Array.from(techSet).sort();
};

/**
 * Get top N most used technologies from projects
 */
export const getTopTechStack = (limit: number = 8): string[] => {
  const techCount = new Map<string, number>();
  
  // Count occurrences of each technology
  projects.forEach(project => {
    project.tech.forEach(tech => {
      techCount.set(tech, (techCount.get(tech) || 0) + 1);
    });
  });
  
  // Sort by count and get top N
  return Array.from(techCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([tech]) => tech);
};

/**
 * Get total number of skill categories
 */
export const getSkillCategoriesCount = (): number => {
  return Object.keys(skills).length;
};

/**
 * Get total number of individual skills
 */
export const getTotalSkillsCount = (): number => {
  return Object.values(skills).reduce((total, skillList) => total + skillList.length, 0);
};
