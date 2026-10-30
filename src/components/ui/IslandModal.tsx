import React, { useState, useMemo, useEffect } from 'react';
import {
  X,
  ExternalLink,
  Award,
  BookOpen,
  Briefcase,
  Layers,
  Mail,
  FileText,
  Compass,
  MapPin,
  CheckCircle,
  Search,
  Users,
  GitBranch,
  ShieldCheck,
  Building2,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';
import { IslandId } from '../../types';
import { islandNames } from '../../types';
import { GithubIcon } from '../common/Icons';
import { ISLANDS } from '../../data/islands';
import { siteConfig } from '../../data/siteConfig';
import { projects } from '../../data/projects';
import { skills } from '../../data/skills';
import { experiences } from '../../data/experience';
import { achievements } from '../../data/achievements';
import { educations } from '../../data/education';
import { openSourceContributions } from '../../data/openSource';
import { journalArticles } from '../../data/journal';
import { sortDescByDate, parseDateToScore, getItemDateScore } from '../../utils/sorting';

interface IslandModalProps {
  islandId: IslandId | null;
  onClose: () => void;
  onOpenJourney: () => void;
}

export const IslandModal: React.FC<IslandModalProps> = ({
  islandId,
  onClose,
  onOpenJourney,
}) => {
  const [projectCategory, setProjectCategory] = useState<string>('All');
  const [projectSearch, setProjectSearch] = useState<string>('');
  const [selectedSkillCategory, setSelectedSkillCategory] = useState<string>('Cloud & AWS');

  // Handle Escape key to close modal
  useEffect(() => {
    if (!islandId) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [islandId, onClose]);

  // Sorted data using descending chronological utilities (latest first)
  const sortedProjects = useMemo(() => {
    const list = sortDescByDate(projects, (p) =>
      getItemDateScore(p.endDate, p.startDate, p.ongoing)
    );
    return list.filter((p) => {
      const matchesCategory = projectCategory === 'All' || p.category === projectCategory;
      const matchesSearch =
        projectSearch === '' ||
        p.title.toLowerCase().includes(projectSearch.toLowerCase()) ||
        p.description.toLowerCase().includes(projectSearch.toLowerCase()) ||
        p.tech.some((t) => t.toLowerCase().includes(projectSearch.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [projectCategory, projectSearch]);

  const sortedExperiences = useMemo(() => {
    return sortDescByDate(experiences, (e) =>
      getItemDateScore(e.endDate, e.startDate)
    );
  }, []);

  const sortedLeadership = useMemo(() => {
    const leadershipRoles = experiences.filter(
      (e) => e.type === 'leadership' || e.type === 'volunteer'
    );
    const list = leadershipRoles.length > 0 ? leadershipRoles : experiences;
    return sortDescByDate(list, (e) => getItemDateScore(e.endDate, e.startDate));
  }, []);

  const sortedAchievements = useMemo(() => {
    const awards = achievements.filter((a) => a.category === 'award');
    return sortDescByDate(awards, (a) => parseDateToScore(a.date));
  }, []);

  const sortedCertifications = useMemo(() => {
    const certs = achievements.filter((a) => a.category === 'certification');
    return sortDescByDate(certs, (c) => parseDateToScore(c.date));
  }, []);

  const sortedOpenSource = useMemo(() => {
    return sortDescByDate(openSourceContributions, (os) =>
      getItemDateScore(os.endDate, os.startDate, os.status === 'active')
    );
  }, []);

  const sortedEducations = useMemo(() => {
    return sortDescByDate(educations, (e) =>
      getItemDateScore(e.endDate, e.startDate)
    );
  }, []);

  const sortedPublications = useMemo(() => {
    return sortDescByDate(journalArticles, (j) => parseDateToScore(j.date));
  }, []);

  if (!islandId) return null;

  const island = ISLANDS.find((i) => i.id === islandId);
  const currentIslandName = islandNames[islandId] || island?.name || 'Island';
  const isHomeIsland = islandId === 'home' || islandId === 'identity' || islandId === 'about';

  return (
    <>
      {/* Background Dimming Backdrop Overlay:
          On desktop, transparent click-to-close region on the left allowing unobstructed view of the 3D island */}
      <div
        className="fixed inset-0 md:right-[38%] md:max-w-[calc(100vw-380px)] z-[90] bg-slate-950/30 md:bg-transparent backdrop-blur-[2px] md:backdrop-blur-none cursor-pointer"
        onClick={onClose}
        title="Click to return to Overview"
        aria-hidden="true"
      />

      {/* Main Drawer Panel:
          Desktop: Right-side information panel (~38% width) pairing with the left-side live 3D island view
          Mobile: Bottom sheet drawer (72vh) */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${currentIslandName} Explorer`}
        className="fixed inset-x-0 bottom-0 md:inset-y-0 md:left-auto md:right-0 z-[100] h-[72vh] md:h-full w-full md:w-[38%] md:min-w-[400px] md:max-w-[560px] bg-slate-950/95 backdrop-blur-2xl border-t md:border-t-0 md:border-l border-sky-400/30 rounded-t-3xl md:rounded-none shadow-[0_-10px_40px_rgba(0,0,0,0.8)] md:shadow-[-20px_0_50px_rgba(0,0,0,0.85)] flex flex-col transition-all duration-300 animate-fade-in"
      >
        {/* Header with Back to Overview / Close Button */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full shadow-lg shrink-0"
                style={{ backgroundColor: island?.color || '#38bdf8' }}
              />
              <span className="text-[11px] font-mono uppercase tracking-wider text-sky-400 font-bold">
                Pamuda's World
              </span>
              {isHomeIsland && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/40 font-semibold">
                  Colombo, Sri Lanka
                </span>
              )}
            </div>
            <h2 className="text-lg sm:text-xl font-bold font-display text-white mt-0.5">
              {currentIslandName}
            </h2>
            <p className="text-xs text-slate-300 font-medium line-clamp-1">
              {isHomeIsland ? 'Hometown Colombo, Sri Lanka • Central Island' : island?.tagline}
            </p>
          </div>

          {/* <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700/60 shadow transition-all flex items-center gap-1.5 shrink-0 hover:scale-105 active:scale-95"
            title="Return to 3D World Overview"
            aria-label="Back to Overview"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-xs font-semibold hidden sm:inline">Back to Overview</span>
            <X className="w-3.5 h-3.5 sm:hidden" />
          </button> */}
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          
          {/* ==================== 1. HOME ISLAND ==================== */}
          {isHomeIsland && (
            <div className="space-y-6">
              {/* Professional Identity Card: Dark Slate-Navy Glass Panel with Sky Accents */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-slate-950/95 border border-sky-500/20 shadow-2xl text-slate-100 space-y-5 backdrop-blur-md">
                <div className="flex flex-col sm:flex-row items-center gap-5">
                  <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-sky-500/40 shadow-lg shrink-0 bg-slate-800">
                    <img
                      src="/Profile2.png"
                      alt={siteConfig.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/profile.jpg';
                      }}
                    />
                  </div>
                  <div className="space-y-1.5 text-center sm:text-left">
                    <h3 className="text-2xl font-black text-white font-display tracking-tight">
                      Pamuda U. de A. Goonatilake
                    </h3>
                    <div className="text-xs font-semibold text-sky-400 flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                      <span>Computer Science Undergraduate</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-300 font-medium">University of Jaffna</span>
                    </div>
                    <div className="text-xs font-medium text-slate-300">
                      Building Software. Exploring Cloud. Learning Reliability.
                    </div>
                    <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-[11px] font-medium text-slate-300">
                        <MapPin className="w-3 h-3 text-sky-400" />
                        Colombo, Sri Lanka (Hometown)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Short Technical Introduction */}
                <div className="pt-3 border-t border-slate-800/80">
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400/90 mb-1.5">
                    Technical Focus & Interests
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    I am passionate about designing and building scalable, reliable distributed systems with a dedicated focus on:
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {[
                      'Software Development',
                      'Cloud Computing',
                      'DevOps',
                      'Site Reliability Engineering',
                      'Cloud-Native Technologies',
                    ].map((interest) => (
                      <span
                        key={interest}
                        className="px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-300 text-xs font-semibold border border-sky-500/30"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Selected Professional Highlights */}
                <div className="pt-3 border-t border-slate-800/80">
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400/90 mb-2.5">
                    Selected Professional Highlights
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 font-medium text-slate-200">
                      <span className="w-2.5 h-2.5 rounded-full bg-sky-400 shrink-0" />
                      <span>Founding AWS Student Builder Group Leader at University of Jaffna</span>
                    </div>
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 font-medium text-slate-200">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-400 shrink-0" />
                      <span>Project Vice Chair (Finance & Partnerships) of IEEE StudPro 9.0</span>
                    </div>
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 font-medium text-slate-200">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
                      <span>AWS Certified Cloud Practitioner</span>
                    </div>
                    
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 font-medium text-slate-200">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 shrink-0" />
                      <span>1x Salesforce Certified</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-center shadow">
                  <div className="text-2xl font-bold text-sky-400">{projects.length}</div>
                  <div className="text-[11px] text-slate-300 font-medium">Projects Built</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-center shadow">
                  <div className="text-2xl font-bold text-amber-400">600+</div>
                  <div className="text-[11px] text-slate-300 font-medium">AWS Community</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-center shadow">
                  <div className="text-2xl font-bold text-emerald-400">{sortedCertifications.length}</div>
                  <div className="text-[11px] text-slate-300 font-medium">Certifications</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-center shadow">
                  <div className="text-2xl font-bold text-purple-400">{sortedAchievements.length}</div>
                  <div className="text-[11px] text-slate-300 font-medium">Awards & Honors</div>
                </div>
              </div>

              {/* Personal Journey Callout */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-sky-400/30 flex items-center justify-between shadow">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Compass className="w-4 h-4 text-sky-400" />
                    From Sri Lanka to the Global Cloud
                  </h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Discover how Colombo roots, University of Jaffna academics, and AWS leadership converged.
                  </p>
                </div>
                <button
                  onClick={onOpenJourney}
                  className="btn-primary text-xs py-2 px-4 shrink-0 ml-3"
                >
                  View Journey
                </button>
              </div>
            </div>
          )}

          {/* ==================== 2. PROJECTS ISLAND ==================== */}
          {islandId === 'projects' && (
            <div className="space-y-5">
              {/* Search and Category Filter */}
              <div className="space-y-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search projects by name, description or technology..."
                    value={projectSearch}
                    onChange={(e) => setProjectSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-sky-400"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1.5">
                    {['All', 'Cloud', 'Web', 'Mobile', 'IoT', 'AI'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setProjectCategory(cat)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                          projectCategory === cat
                            ? 'bg-sky-500 text-white shadow'
                            : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-700'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                  <span className="text-xs font-mono text-slate-300 font-medium">
                    Projects ({sortedProjects.length})
                  </span>
                </div>
              </div>

              {/* Complete Project List */}
              <div className="space-y-4">
                {sortedProjects.map((project) => (
                  <div
                    key={project.id}
                    className="p-4 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-sky-400/60 transition space-y-3 shadow-md"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="text-base font-bold text-white">
                          {project.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-slate-300 mt-0.5 font-medium">
                          <span className="text-sky-300 font-semibold">{project.category}</span>
                          <span>•</span>
                          <span className="text-slate-300">{project.startDate} - {project.endDate}</span>
                        </div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-200 border border-slate-600 shrink-0 font-medium">
                        {project.projectType}
                      </span>
                    </div>

                    <p className="text-xs text-slate-200 leading-relaxed font-normal">
                      {project.description}
                    </p>

                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-1.5">
                      {project.tech.map((t, idx) => (
                        <span key={idx} className="badge-tech text-[10px]">
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Links */}
                    <div className="flex items-center gap-3 pt-1">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-semibold text-sky-400 hover:text-sky-200 flex items-center gap-1"
                        >
                          <GithubIcon className="w-3.5 h-3.5" /> Code Repo
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-semibold text-amber-400 hover:text-amber-200 flex items-center gap-1"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                        </a>
                      )}
                      {project.linkedinProjectUrl && (
                        <a
                          href={project.linkedinProjectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-semibold text-sky-400 hover:text-sky-200 flex items-center gap-1"
                        >
                          Article / Post
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== 3. SKILLS ISLAND ==================== */}
          {islandId === 'skills' && (
            <div className="space-y-5">
              <div className="flex flex-wrap gap-2">
                {Object.keys(skills).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedSkillCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      selectedSkillCategory === cat
                        ? 'bg-sky-500 text-white shadow'
                        : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-700/80 space-y-4 shadow-md">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-sky-400" />
                  {selectedSkillCategory} ({skills[selectedSkillCategory]?.length || 0})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {skills[selectedSkillCategory]?.map((skill, idx) => (
                    <div
                      key={idx}
                      className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-600 text-xs font-semibold text-slate-100 flex items-center gap-2 hover:border-sky-400 transition"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-sky-400" />
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ==================== 4. EXPERIENCE ISLAND ==================== */}
          {islandId === 'experience' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Chronological Experience ({sortedExperiences.length})
                </span>
              </div>
              {sortedLeadership.map((exp) => (
                <div
                  key={exp.id}
                  className="p-4 rounded-xl bg-slate-900 border border-slate-700/80 space-y-2 hover:border-sky-400/50 transition shadow-md"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-base font-bold text-white">{exp.role}</h4>
                      <div className="text-xs text-sky-300 font-semibold">
                        {exp.organization}
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-300 whitespace-nowrap font-mono font-medium">
                      {exp.startDate} - {exp.endDate || 'Present'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-normal">
                    {exp.description}
                  </p>
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="list-disc list-inside text-xs text-slate-300 space-y-1 pt-1 font-medium">
                      {exp.highlights.map((h, idx) => (
                        <li key={idx}>{h}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ==================== 5. LEADERSHIP ISLAND ==================== */}
          {islandId === 'leadership' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  Community Leadership & Student Builder Initiatives
                </span>
              </div>
              {sortedExperiences.map((exp) => (
                <div
                  key={exp.id}
                  className="p-4 rounded-xl bg-slate-900 border border-slate-700/80 space-y-2 hover:border-amber-400/50 transition shadow-md"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-base font-bold text-white">{exp.role}</h4>
                      <div className="text-xs text-amber-300 font-semibold">
                        {exp.organization}
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-300 whitespace-nowrap font-mono font-medium">
                      {exp.startDate} - {exp.endDate || 'Present'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-normal">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* ==================== 6. ACHIEVEMENTS ISLAND ==================== */}
          {islandId === 'achievements' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                  <Award className="w-4 h-4" />
                  Competitive Awards & Hackathon Honors ({sortedAchievements.length})
                </span>
              </div>
              {sortedAchievements.map((award) => (
                <div
                  key={award.id}
                  className="p-4 rounded-xl bg-slate-900 border border-amber-500/30 hover:border-amber-500/60 transition space-y-2 shadow-md"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-amber-400 shrink-0" />
                      <h4 className="text-base font-bold text-white">
                        {award.title}
                      </h4>
                    </div>
                    <span className="text-xs text-slate-300 whitespace-nowrap font-mono font-medium">
                      {award.date}
                    </span>
                  </div>
                  <div className="text-xs text-amber-300 font-semibold">
                    Issued by: {award.issuer}
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-normal">
                    {award.detailedDescription || award.description}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* ==================== 7. EDUCATION ISLAND ==================== */}
          {islandId === 'education' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  Academic Background ({sortedEducations.length})
                </span>
              </div>
              {sortedEducations.map((edu) => (
                <div
                  key={edu.id}
                  className="p-4 rounded-xl bg-slate-900 border border-slate-700/80 space-y-2 shadow-md"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h5 className="font-bold text-white text-base">
                      {edu.degree} {edu.field}
                    </h5>
                    <span className="text-xs text-slate-300 font-mono font-medium">
                      {edu.startDate} - {edu.endDate}
                    </span>
                  </div>
                  <div className="text-xs text-purple-300 font-semibold">
                    {edu.institution}
                  </div>
                  {edu.grade && (
                    <div className="text-xs text-emerald-300 font-semibold">Grade: {edu.grade}</div>
                  )}
                  {edu.description && (
                    <p className="text-xs text-slate-200 leading-relaxed pt-1 font-normal">
                      {edu.description}
                    </p>
                  )}
                  {edu.activities && edu.activities.length > 0 && (
                    <div className="pt-2">
                      <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                        Activities & Roles:
                      </div>
                      <ul className="list-disc list-inside text-xs text-slate-300 space-y-0.5 font-medium">
                        {edu.activities.slice(0, 5).map((act, idx) => (
                          <li key={idx}>{act}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ==================== 8. CERTIFICATIONS ISLAND ==================== */}
          {islandId === 'certifications' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  All Verified Certifications ({sortedCertifications.length})
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {sortedCertifications.map((cert) => (
                  <div
                    key={cert.id}
                    className="p-3.5 rounded-xl bg-slate-900 border border-emerald-500/30 hover:border-emerald-500/60 transition flex flex-col justify-between space-y-2 shadow-md"
                  >
                    <div>
                      <h5 className="text-xs font-bold text-white leading-tight">
                        {cert.title}
                      </h5>
                      <div className="text-[11px] text-emerald-300 font-semibold mt-1">
                        {cert.issuer}
                      </div>
                      <div className="text-[10px] text-slate-300 font-mono mt-0.5 font-medium">
                        {cert.date}
                      </div>
                    </div>
                    {cert.link && (
                      <a
                        href={cert.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-sky-400 hover:text-sky-200 flex items-center gap-1 font-semibold pt-1"
                      >
                        <ExternalLink className="w-3 h-3" /> Verify Credential
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== 9. OPEN SOURCE ISLAND ==================== */}
          {islandId === 'opensource' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-300 flex items-center gap-1.5">
                  <GitBranch className="w-4 h-4" />
                  Open Source Contributions ({sortedOpenSource.length})
                </span>
              </div>
              {sortedOpenSource.map((os) => (
                <div
                  key={os.id}
                  className="p-4 rounded-xl bg-slate-900 border border-teal-500/30 hover:border-teal-500/60 transition space-y-2.5 shadow-md"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-base font-bold text-white">
                        {os.projectName}
                      </h4>
                      <div className="text-xs text-teal-300 font-semibold">
                        {os.organization} • {os.role}
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-200 border border-teal-500/40 font-semibold">
                      {os.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-200 leading-relaxed font-normal">
                    {os.description}
                  </p>

                  {os.contributions && (
                    <ul className="list-disc list-inside text-xs text-slate-300 space-y-1 font-medium">
                      {os.contributions.map((c, idx) => (
                        <li key={idx}>{c}</li>
                      ))}
                    </ul>
                  )}

                  <div className="flex items-center gap-3 pt-1">
                    {os.githubUrl && (
                      <a
                        href={os.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-sky-400 hover:text-sky-200 flex items-center gap-1"
                      >
                        <GithubIcon className="w-3.5 h-3.5" /> Repository
                      </a>
                    )}
                    {os.websiteUrl && (
                      <a
                        href={os.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-teal-300 hover:text-teal-200 flex items-center gap-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Project Site
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ==================== 10. PUBLICATIONS ISLAND ==================== */}
          {islandId === 'publications' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  Verified Publications & Technical Research ({sortedPublications.length})
                </span>
              </div>
              {sortedPublications.map((article) => (
                <div
                  key={article.id}
                  className="p-4 rounded-xl bg-slate-900 border border-indigo-500/30 hover:border-indigo-500/60 transition space-y-2.5 shadow-md"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-base font-bold text-white leading-snug">
                        {article.title}
                      </h4>
                      <div className="text-xs text-indigo-300 font-semibold mt-1">
                        {article.category} • {article.date} • {article.readTime}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-200 leading-relaxed font-normal">
                    {article.abstract}
                  </p>

                  {article.highlights && (
                    <ul className="list-disc list-inside text-xs text-slate-300 space-y-1 font-medium">
                      {article.highlights.map((h, idx) => (
                        <li key={idx}>{h}</li>
                      ))}
                    </ul>
                  )}

                  {/* Research Methodology Pipeline for Microservice Failure Detection */}
                  {article.category === 'Undergraduate Research' && (
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-indigo-500/40 space-y-2 mt-2">
                      <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-300">
                        Proposed Research Methodology Pipeline
                      </div>
                      <div className="flex flex-col gap-1.5 text-xs">
                        <div className="p-2 rounded-lg bg-indigo-950/60 border border-indigo-500/30 text-center font-semibold text-slate-200">
                          Normal Monitoring Data (RCAEval Benchmark: 735 cases across Online Boutique, Sock Shop, Train Ticket)
                        </div>
                        <div className="text-center text-indigo-400 font-bold text-xs">↓</div>
                        <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-mono">
                          <div className="p-1.5 rounded bg-slate-900 border border-indigo-500/40 text-indigo-200 font-medium">Same-Run Baseline</div>
                          <div className="p-1.5 rounded bg-slate-900 border border-indigo-500/40 text-indigo-200 font-medium">Other-Run Baseline</div>
                          <div className="p-1.5 rounded bg-slate-900 border border-indigo-500/40 text-indigo-200 font-medium">Pooled-Run Baseline</div>
                        </div>
                        <div className="text-center text-indigo-400 font-bold text-xs">↓</div>
                        <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-mono">
                          <div className="p-1.5 rounded bg-slate-900 border border-sky-500/40 text-sky-200 font-medium">Infrastructure Metrics</div>
                          <div className="p-1.5 rounded bg-slate-900 border border-sky-500/40 text-sky-200 font-medium">Service Response Signals</div>
                          <div className="p-1.5 rounded bg-slate-900 border border-sky-500/40 text-sky-200 font-medium">Combined Signals</div>
                        </div>
                        <div className="text-center text-indigo-400 font-bold text-xs">↓</div>
                        <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-center font-semibold text-emerald-200">
                          Isolation Forest Failure Detection Evaluation (Precision, Recall, F1, Consistency)
                        </div>
                      </div>
                    </div>
                  )}

                  {article.link && (
                    <div className="pt-1">
                      <a
                        href={article.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-sky-400 hover:text-sky-200 flex items-center gap-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Read Publication / Article
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ==================== 11. CONTACT ISLAND ==================== */}
          {islandId === 'contact' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-700/80 space-y-3 shadow-md">
                <h4 className="text-sm font-bold text-white">Get In Touch</h4>
                <p className="text-xs text-slate-200 leading-relaxed font-normal">
                  Interested in cloud engineering, DevOps, software development, or community collaboration? Reach out directly:
                </p>
                <div className="flex items-center gap-2 text-xs font-mono text-sky-300 font-semibold">
                  <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                  <a href={`mailto:${siteConfig.email}`} className="hover:underline">
                    {siteConfig.email}
                  </a>
                </div>
                <div className="pt-2">
                  <a
                    href={siteConfig.cvUrl}
                    download="Pamuda_CV.pdf"
                    className="btn-primary text-xs py-2 px-4 flex items-center gap-2 w-fit"
                  >
                    <FileText className="w-4 h-4" /> Download Official CV
                  </a>
                </div>
              </div>

              {/* Social Links Grid */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Network & Builder Profiles
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Object.entries(siteConfig.social).map(([platform, url]) => (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white hover:border-sky-400 transition capitalize flex items-center justify-between shadow-sm"
                    >
                      <span>{platform}</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/95 flex items-center justify-between text-xs text-slate-300">
          <span className="font-medium text-slate-400">Pamuda's World • {siteConfig.name}</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold transition-all shadow-md shadow-sky-500/20 flex items-center gap-2 hover:scale-105 active:scale-95 border border-sky-400/30"
            title="Return to 3D World Overview"
            aria-label="Back to 3D World Overview"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Overview</span>
          </button>
        </div>
      </div>
    </>
  );
};
