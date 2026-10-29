// Open Source Contributions data
export interface OpenSourceContribution {
  id: string;
  projectName: string;
  organization: string;
  shortDescription: string; // Brief 1-2 line summary for cards
  description: string;
  role: string; // e.g., "Contributor", "Core Maintainer", "Documentation"
  contributions: string[]; // List of specific contributions
  tech: string[];
  githubUrl: string;
  websiteUrl?: string;
  stars?: number; // GitHub stars
  status: "active" | "completed"; // Current involvement status
  startDate: string; // Format: "Month YYYY"
  endDate?: string; // Format: "Month YYYY" or leave empty if active
}

export const openSourceContributions: OpenSourceContribution[] = [
  
  {
    id: "1",
    projectName: "AnimateItNow",
    organization: "GirlScript Summer of Code 2025",
    shortDescription: "Contributed bug fixes and documentation improvements to animation library during GSSoC 2025.",
    description: "Open source animation library. Contributed code improvements and bug fixes during GirlScript Summer of Code 2025.",
    role: "Contributor",
    contributions: [
      "1 commit merged to main branch",
      "1 Pull Request successfully merged",
      "Fixed animation rendering issues",
      "Improved documentation for animation components",
    ],
    tech: ["JavaScript", "CSS", "HTML", "Animations"],
    githubUrl: "https://github.com/itsAnimation/AnimateItNow",
    websiteUrl: "https://github.com/itsAnimation/AnimateItNow",
    status: "completed",
    startDate: "Jul 2025",
    endDate: "Oct 2025",
  },
  {
    id: "2",
    projectName: "OpenChoreo",
    organization: "WSO2 Hacktoberfest 2025",
    shortDescription: "Contributed to WSO2's open-source internal developer platform during Hacktoberfest 2025.",
    description: "OpenChoreo is an open-source internal developer platform (IDP) by WSO2. I contributed to this project during Hacktoberfest 2025, the global open source contribution initiative. The platform helps developers streamline their development workflows, manage deployments, and improve developer productivity. Built with Go and licensed under Apache License 2.0, it represents enterprise-grade open-source development practices.",
    role: "Contributor",
    contributions: [
      "Contributed to internal developer platform (IDP)",
      "Improved developer workflow automation",
      "Enhanced deployment management features",
      "Participated in Hacktoberfest 2025 global initiative",
      "Collaborated with international developer community",
    ],
    tech: ["Go", "IDP", "DevOps", "WSO2", "Open Source", "Java", "JavaScript"],
    githubUrl: "https://github.com/openchoreo/openchoreo",
    websiteUrl: "https://github.com/openchoreo/openchoreo",
    status: "completed",
    startDate: "Oct 2025",
    endDate: "Oct 2025",
  },
  {
    id: "3",
    projectName: "AWS Community World",
    organization: "AWS Community",
    shortDescription: "Open-source interactive 3D geospatial visualisation of global AWS user groups and cloud clubs.",
    description: "An open-source interactive 3D geospatial visualisation platform mapping AWS user groups, cloud clubs, and community hubs across the globe. Features high-performance interactive globe rendering using Three.js and globe.gl with MapLibre and D3 geo utilities.",
    role: "Open Source Contributor & Creator",
    contributions: [
      "Developed interactive 3D globe visualization for global AWS community hubs",
      "Integrated Three.js, globe.gl, and MapLibre geospatial rendering engines",
      "Structured community data mapping and search functionality",
      "Open-sourced repository for community-driven contributions",
    ],
    tech: ["React", "Vite", "Tailwind CSS", "Three.js", "globe.gl", "MapLibre", "D3", "Open Source"],
    githubUrl: "https://github.com/PamudaUposath/aws-community-world",
    websiteUrl: "https://awscommunityglobe.click/",
    status: "active",
    startDate: "Jan 2026",
    endDate: "Present",
  },
  // {
  //   id: "3",
  //   projectName: "ResQ",
  //   organization: "Disaster Response SL",
  //   shortDescription: "Open-source disaster response platform for Sri Lanka's November 2025 crisis with real-time coordination.",
  //   description: "ResQ is an open-source disaster response platform that I contributed to during the November 2025 disaster in Sri Lanka. The platform facilitates emergency coordination, resource allocation, and real-time communication during disaster situations. Built with TypeScript and licensed under Apache 2.0, it demonstrates the power of open-source collaboration in crisis management.",
  //   role: "Contributor",
  //   contributions: [
  //     "Contributed to disaster response platform development",
  //     "Implemented real-time communication features",
  //     "Helped coordinate emergency response efforts",
  //     "Participated in crisis management solution",
  //   ],
  //   tech: ["TypeScript", "Disaster Response", "Real-time Communication", "Open Source"],
  //   githubUrl: "https://github.com/disaster-response-sl/resq",
  //   websiteUrl: "https://github.com/disaster-response-sl/resq",
  //   status: "completed",
  //   startDate: "Nov 2025",
  // },
];
