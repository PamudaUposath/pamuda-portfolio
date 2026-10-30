import { IslandData, islandNames } from '../types';

export const ISLANDS: IslandData[] = [
  // ==================== 1. CENTRAL ISLAND: HOME ISLAND (COLOMBO, SRI LANKA) ====================
  {
    id: 'home',
    name: islandNames.home,
    tagline: 'Hometown Colombo, Sri Lanka • Origins & Identity',
    location: 'Colombo, Sri Lanka',
    category: 'Home',
    position: [0, 1.8, 0],
    cameraPosition: [0, 11.5, 18.0],
    cameraTarget: [-2.0, 1.8, 0],
    color: '#38bdf8',
    badge: 'Colombo, Sri Lanka',
  },

  // ==================== 2. UPPER LEFT: PROJECTS ISLAND ====================
  {
    id: 'projects',
    name: islandNames.projects,
    tagline: 'Verified Software & Cloud Systems',
    category: 'Projects',
    position: [-22.0, 3.2, -18.0],
    cameraPosition: [-18.5, 11.5, -3.0],
    cameraTarget: [-24.0, 3.2, -18.0],
    color: '#ff9900',
    badge: '20 Projects',
  },

  // ==================== 3. UPPER MIDDLE-LEFT: SKILLS ISLAND ====================
  {
    id: 'skills',
    name: islandNames.skills,
    tagline: 'Cloud, DevOps & Engineering Stack',
    category: 'Skills',
    position: [-8.5, 3.5, -19.5],
    cameraPosition: [-5.0, 11.8, -4.5],
    cameraTarget: [-11.0, 3.5, -19.5],
    color: '#06b6d4',
    badge: '80+ Skills',
  },

  // ==================== 4. UPPER MIDDLE-RIGHT: EXPERIENCE ISLAND ====================
  {
    id: 'experience',
    name: islandNames.experience,
    tagline: 'Professional Roles & Engineering Work',
    category: 'Experience',
    position: [8.5, 3.5, -19.5],
    cameraPosition: [12.0, 11.8, -4.5],
    cameraTarget: [6.0, 3.5, -19.5],
    color: '#3b82f6',
    badge: 'Engineering Roles',
  },

  // ==================== 5. UPPER RIGHT: ACHIEVEMENTS ISLAND ====================
  {
    id: 'achievements',
    name: islandNames.achievements,
    tagline: 'Hackathon Victories & Competitive Awards',
    category: 'Achievements',
    position: [22.0, 3.2, -18.0],
    cameraPosition: [25.5, 11.5, -3.0],
    cameraTarget: [19.5, 3.2, -18.0],
    color: '#eab308',
    badge: 'Awards & Honors',
  },

  // ==================== 6. MIDDLE LEFT: LEADERSHIP ISLAND ====================
  {
    id: 'leadership',
    name: islandNames.leadership,
    tagline: 'AWS Student Builder Group & Community Leadership',
    category: 'Leadership',
    position: [-23.5, 2.2, -1.0],
    cameraPosition: [-20.0, 10.5, 14.0],
    cameraTarget: [-26.0, 2.2, -1.0],
    color: '#f59e0b',
    badge: 'Community Leadership',
  },

  // ==================== 7. MIDDLE RIGHT: PUBLICATIONS ISLAND ====================
  {
    id: 'publications',
    name: islandNames.publications,
    tagline: 'Research Proposals, Articles & Technical Writing',
    category: 'Publications',
    position: [23.5, 2.2, -1.0],
    cameraPosition: [27.0, 10.5, 14.0],
    cameraTarget: [21.0, 2.2, -1.0],
    color: '#6366f1',
    badge: 'Research & Articles',
  },

  // ==================== 8. LOWER LEFT: OPEN SOURCE ISLAND ====================
  {
    id: 'opensource',
    name: islandNames.opensource,
    tagline: 'Community Contributions & Global Repositories',
    category: 'Open Source',
    position: [-20.5, 1.4, 15.0],
    cameraPosition: [-17.0, 9.8, 30.0],
    cameraTarget: [-23.0, 1.4, 15.0],
    color: '#14b8a6',
    badge: 'Open Source',
  },

  // ==================== 9. LOWER MIDDLE-LEFT: EDUCATION ISLAND ====================
  {
    id: 'education',
    name: islandNames.education,
    tagline: 'Computer Science at University of Jaffna',
    category: 'Education',
    position: [-8.0, 1.2, 17.0],
    cameraPosition: [-4.5, 9.5, 32.0],
    cameraTarget: [-10.5, 1.2, 17.0],
    color: '#8b5cf6',
    badge: 'BSc (Hons) in CS',
  },

  // ==================== 10. LOWER MIDDLE-RIGHT: CERTIFICATIONS ISLAND ====================
  {
    id: 'certifications',
    name: islandNames.certifications,
    tagline: 'AWS, GCP, Postman & Developer Credentials',
    category: 'Certifications',
    position: [8.0, 1.2, 17.0],
    cameraPosition: [11.5, 9.5, 32.0],
    cameraTarget: [5.5, 1.2, 17.0],
    color: '#10b981',
    badge: '21 Certifications',
  },

  // ==================== 11. LOWER RIGHT: CONTACT ISLAND ====================
  {
    id: 'contact',
    name: islandNames.contact,
    tagline: 'Connect Directly, CV Download & Messaging',
    category: 'Contact',
    position: [20.5, 1.4, 15.0],
    cameraPosition: [24.0, 9.8, 30.0],
    cameraTarget: [18.0, 1.4, 15.0],
    color: '#ec4899',
    badge: 'Get in Touch',
  },
];
