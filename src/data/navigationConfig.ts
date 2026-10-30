import type { IslandId } from '../types';

export interface NavItemConfig {
  id: IslandId;
  label: string;
  destination: string;
  color: string;
}

export const navigationConfig: {
  top: NavItemConfig[];
  bottom: NavItemConfig[];
} = {
  // Top Centre Primary Navigation: 5 Main Destinations
  top: [
    { id: 'home', label: 'Home', destination: 'Home Island', color: '#38bdf8' },
    { id: 'projects', label: 'Projects', destination: 'Projects Island', color: '#f59e0b' },
    { id: 'skills', label: 'Skills', destination: 'Skills Island', color: '#06b6d4' },
    { id: 'experience', label: 'Experience', destination: 'Experience Island', color: '#3b82f6' },
    { id: 'achievements', label: 'Achievements', destination: 'Achievements Island', color: '#f59e0b' },
  ],

  // Bottom Centre Island Navigation Dock: 6 Remaining Destinations
  bottom: [
    { id: 'leadership', label: 'Leadership', destination: 'Leadership Island', color: '#eab308' },
    { id: 'opensource', label: 'Open Source', destination: 'Open Source Island', color: '#14b8a6' },
    { id: 'education', label: 'Education', destination: 'Education Island', color: '#a855f7' },
    { id: 'certifications', label: 'Certifications', destination: 'Certifications Island', color: '#10b981' },
    { id: 'publications', label: 'Publications', destination: 'Publications Island', color: '#6366f1' },
    { id: 'contact', label: 'Contact', destination: 'Contact Island', color: '#ec4899' },
  ],
};
