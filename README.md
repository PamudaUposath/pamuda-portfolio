# Pamuda's World: Interactive 3D Cloud Portfolio
> **Author:** Pamuda U. de A. Goonatilake  
> **Degree:** B.Sc. (Hons) in Computer Science, University of Jaffna  
> **Tagline:** Building Software. Exploring Cloud. Learning Reliability.  
> **Deployment Platform:** AWS Amplify Hosting + Amazon CloudFront  

---

## 🌟 Executive Overview
**Pamuda's World** is a modern, interactive 3D cloud portfolio that transforms the personal developer showcase into an immersive celestial experience. Visitors explore a connected world of eleven floating islands above an animated cloud ocean, showcasing verified software systems, cloud infrastructure engineering, community leadership, and interactive demonstrations.

The platform provides dual access:
1. **3D World Explorer Mode:** Cinematic orbital camera navigation, medium-distance island framing, interactive floating terrain, and responsive information drawers.
2. **2D Portfolio Mode:** A high-speed, accessible executive interface displaying all projects, experiences, certifications, awards, and verified credentials.

---

## 🏝️ The 11 Standardized Islands
Every island in Pamuda's World follows a strict `<Name> Island` standard:

1. **About Island:** Personal background, University of Jaffna academic roots, bio narrative, and interactive journey.
2. **Projects Island:** Complete showcase of 20 verified software, cloud, web, and mobile systems with search and category filtering.
3. **Skills Island:** Interactive technology matrix categorizing 80+ competencies across Cloud & AWS, DevOps, AI/ML, Backend, and Systems.
4. **Experience Island:** Professional engineering roles, internships, and milestone delivery.
5. **Leadership Island:** AWS Student Builder Group community leadership and IEEE executive positions.
6. **Achievements Island:** Cloud-themed dais and glowing trophy display celebrating 8 hackathon wins and competitive programming honors (no Sigiriya rock structures).
7. **Education Island:** B.Sc. (Hons) in Computer Science at University of Jaffna, secondary education, and academic milestones.
8. **Certifications Island:** Complete grid of all 21 verified cloud and developer certifications (AWS, Google Cloud, Postman, HackerRank, etc.) sorted in descending chronological order.
9. **Open Source Island:** Global community repositories and open-source contributions.
10. **Publications Island:** Verified articles and publications (*PyWhatKit: Automate WhatsApp with Python* in IEEENews@UoJ, *Kananiyam 2025*, and *AWS New Voices*).
11. **Contact Island:** Modern cloud communication uplink with direct email, verified LinkedIn/GitHub profiles, and official CV download (no lighthouse or rotating beacon).

---

## 🎮 Interactive Features
* **CloudOps: Restore the System:** Real-time SRE incident simulator featuring telemetry spikes, application logs, and multi-step remediation (circuit breaker rate-limiting and connection pool hot-patching).
* **Skills Workstation Console:** Detailed inspection interface mapping technical skills directly to production projects.
* **Wayfinder Navigation Wheel:** Radial controller for quick jump navigation across the floating world.
* **Atmospheric Theme Switcher:** Dynamic sky shaders supporting Sunrise, Daylight, and Night themes.
* **Audio Atmosphere:** Ambient sound controller with mute toggle.

---

## 🛠️ Technology Stack
* **Core:** React 18, TypeScript, Vite
* **3D Graphics:** Three.js, React Three Fiber (`@react-three/fiber`), Drei (`@react-three/drei`)
* **Styling & UI:** Tailwind CSS, Glassmorphic Design System, Lucide React
* **Animation & Visuals:** Framer Motion, Canvas Confetti
* **Hosting:** AWS Amplify Hosting

---

## 🚀 Local Development

```bash
# Navigate to application directory
cd cloudverse

# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev

# Run production build
npm run build

# Preview production build locally
npm run preview -- --port 4173
```
