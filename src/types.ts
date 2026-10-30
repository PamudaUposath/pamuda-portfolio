// Pamuda's World Global Type Definitions

export type IslandId = 
  | 'home'
  | 'identity'
  | 'about'
  | 'projects'
  | 'skills'
  | 'experience'
  | 'leadership'
  | 'opensource'
  | 'achievements'
  | 'education'
  | 'certifications'
  | 'publications'
  | 'contact';

export const islandNames: Record<IslandId, string> = {
  home: "Home Island",
  identity: "Home Island",
  about: "Home Island",
  projects: "Projects Island",
  skills: "Skills Island",
  experience: "Experience Island",
  leadership: "Leadership Island",
  opensource: "Open Source Island",
  achievements: "Achievements Island",
  education: "Education Island",
  certifications: "Certifications Island",
  publications: "Publications Island",
  contact: "Contact Island"
};

export interface IslandData {
  id: IslandId;
  name: string;
  tagline: string;
  location?: string;
  category: string;
  position: [number, number, number];
  cameraTarget: [number, number, number];
  cameraPosition: [number, number, number];
  color: string;
  badge: string;
}

export type ViewMode = '3d' | '2d';

export type CloudTheme = 'sunrise' | 'daylight' | 'night';

export interface IncidentState {
  isActive: boolean;
  isResolved: boolean;
  step: 'alert' | 'investigating' | 'mitigating' | 'resolved';
  selectedRootCause?: string;
  selectedRemediation?: string;
  metrics: {
    p99Latency: number;
    errorRate: number;
    cpuUtil: number;
    memoryUtil: number;
    activePods: number;
  };
}

export interface JournalArticle {
  id: string;
  title: string;
  category: 'Cloud Architecture' | 'Site Reliability' | 'Generative AI' | 'Publications' | 'Technical Article' | 'Industry Analysis' | 'Undergraduate Research';
  date: string;
  readTime: string;
  abstract: string;
  tags: string[];
  highlights: string[];
  link?: string;
}
