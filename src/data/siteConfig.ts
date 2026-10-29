// Site configuration - Update with your personal information
import { getProjectsCompletedCount, getYearsOfExperience, getTopTechStack } from "../utils/statsCalculator";

export const siteConfig = {
  name: "Pamuda U. de A. Goonatilake",
  title: "Computer Science Undergraduate | Cloud, DevOps & Site Reliability Engineering",
  tagline: "Computer Science undergraduate at the University of Jaffna with a strong interest in Cloud Computing, DevOps, Site Reliability Engineering, and Software Development. I enjoy building practical systems using AWS, cloud-native technologies, automation tools, and modern software frameworks. I am particularly interested in understanding how reliable and scalable systems are designed, deployed, monitored, and operated.",
  email: "pamudaugoonatilake@gmail.com",
  phone: "", // Optional
  location: "Colombo, Sri Lanka",
  
  // Social links
  social: {
    github: "https://github.com/PamudaUposath",
    linkedin: "https://www.linkedin.com/in/pamuda-uposath-goonatilake",
    whatsapp: "https://wa.me/94", // Format: country code + number (no + or spaces)
    twitter: "https://twitter.com/goonatilakeP", // Optional
    instagram: "https://instagram.com/pamudauposath",
    medium: "https://medium.com/@pamudaugoonatilake",
    tiktok: "https://tiktok.com/@pamudaugoonatilake",
    youtube: "https://youtube.com/@pamutech",
    discord: "994596701174239242", // Discord User ID
    devto: "https://dev.to/pamuda_uposath",
    hashnode: "https://hashnode.com/@pamudauposath",
    kaggle: "https://kaggle.com/pamudagoonatilake",
    awsBuilderCenter: "https://builder.aws.com/community/@pamudauposath?tab=articles",
  },
  
  // Resume/CV link
  cvUrl: "/cv.pdf", // CV located in the public folder
  
  // Stats for hero section - Dynamically calculated from data files
  get stats() {
    return {
      yearsExperience: getYearsOfExperience(),
      projectsCompleted: getProjectsCompletedCount(),
    };
  },
  
  // Tech stack badges for hero section - Dynamically calculated from projects
  get techStack() {
    return getTopTechStack(8);
  },
  
  // Contact form service (using Formspree - get your endpoint from formspree.io)
  formspreeEndpoint: "https://formspree.io/f/mrbnkjpk", // Replace with your Formspree form ID
};
