import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  Cloud,
  Cpu,
  Layers,
  Server,
  Database,
  Radio,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Code2,
  FolderGit2,
} from 'lucide-react';
import { skills } from '../../data/skills';
import { projects, Project } from '../../data/projects';

interface CloudSkillsConsoleProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProject?: (project: Project) => void;
}

export const CloudSkillsConsole: React.FC<CloudSkillsConsoleProps> = ({
  isOpen,
  onClose,
  onSelectProject,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Cloud & AWS');
  const [selectedSkill, setSelectedSkill] = useState<string>('AWS Lambda');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Categories list
  const categories = useMemo(() => Object.keys(skills), []);

  // Filtered skills based on category & search
  const currentSkills = useMemo(() => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const all: { name: string; category: string }[] = [];
      Object.entries(skills).forEach(([cat, list]) => {
        list.forEach((s) => {
          if (s.toLowerCase().includes(q) || cat.toLowerCase().includes(q)) {
            all.push({ name: s, category: cat });
          }
        });
      });
      return all;
    }
    return (skills[selectedCategory] || []).map((s) => ({
      name: s,
      category: selectedCategory,
    }));
  }, [selectedCategory, searchQuery]);

  // Find actual projects tagged with the selected skill
  const relatedProjects = useMemo(() => {
    if (!selectedSkill) return [];
    const skillLower = selectedSkill.toLowerCase();
    return projects.filter((p) =>
      p.tech.some((t) => {
        const tLower = t.toLowerCase();
        return (
          tLower.includes(skillLower) ||
          skillLower.includes(tLower) ||
          (skillLower.includes('aws') && tLower.includes('aws')) ||
          (skillLower.includes('dynamodb') && tLower.includes('dynamodb')) ||
          (skillLower.includes('docker') && tLower.includes('docker')) ||
          (skillLower.includes('python') && tLower.includes('python')) ||
          (skillLower.includes('react') && tLower.includes('react')) ||
          (skillLower.includes('ai') && tLower.includes('ai'))
        );
      })
    );
  }, [selectedSkill]);

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Cloud & AWS':
        return <Cloud className="w-4 h-4 text-amber-400" />;
      case 'DevOps & Cloud-Native':
        return <Server className="w-4 h-4 text-sky-400" />;
      case 'AI & Machine Learning':
        return <Sparkles className="w-4 h-4 text-purple-400" />;
      case 'Backend & APIs':
        return <Cpu className="w-4 h-4 text-emerald-400" />;
      case 'Frontend & Mobile':
        return <Layers className="w-4 h-4 text-cyan-400" />;
      case 'Databases':
        return <Database className="w-4 h-4 text-pink-400" />;
      case 'IoT & Embedded Systems':
        return <Radio className="w-4 h-4 text-orange-400" />;
      default:
        return <Code2 className="w-4 h-4 text-slate-400" />;
    }
  };

  const getSkillProficiency = (name: string) => {
    const expert = [
      'AWS', 'AWS Lambda', 'DynamoDB', 'AWS Amplify', 'Python', 'React',
      'TypeScript', 'Docker', 'REST APIs', 'PostgreSQL', 'Tailwind CSS',
    ];
    if (expert.some((e) => name.toLowerCase().includes(e.toLowerCase()))) {
      return { level: 'Production Experienced', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
    }
    return { level: 'Proficient & Applied', badge: 'bg-sky-500/20 text-sky-300 border-sky-500/40' };
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-slate-900/95 border border-sky-400/30 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(56,189,248,0.2)] flex flex-col overflow-hidden text-slate-100 font-body">
        
        {/* Header HUD */}
        <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between gap-4 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/30">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-display font-extrabold text-base sm:text-lg text-white flex items-center gap-2">
                Interactive Cloud Skills Console
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/40">
                  80+ Verified Technologies
                </span>
              </div>
              <div className="text-xs text-slate-400">
                Click any keycap to inspect architectural applications and linked projects
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition border border-white/5"
            aria-label="Close skills console"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Bar & Search */}
        <div className="p-3 sm:p-4 border-b border-white/10 bg-slate-950/40 flex flex-col sm:flex-row items-center gap-3">
          {/* Real-time search */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search 80+ technologies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-sky-400 transition"
            />
          </div>

          {/* Category Tabs */}
          {!searchQuery && (
            <div className="flex items-center gap-1.5 overflow-x-auto w-full no-scrollbar py-1">
              {categories.slice(0, 7).map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      const firstSkill = skills[cat]?.[0];
                      if (firstSkill) setSelectedSkill(firstSkill);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                    }`}
                  >
                    {getCategoryIcon(cat)}
                    <span>{cat}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Main Console Split: Keycap Grid (Left) + Technology Dossier (Right) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          
          {/* Left: 3D-Style Interactive Workstation Keycaps */}
          <div className="lg:col-span-7 p-4 sm:p-6 overflow-y-auto border-b lg:border-b-0 lg:border-r border-white/10 bg-slate-950/20">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
              <span>{searchQuery ? `Search Results (${currentSkills.length})` : selectedCategory}</span>
              <span className="text-[11px] text-sky-400">Select node to inspect →</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {currentSkills.map(({ name, category }) => {
                const isSelected = selectedSkill === name;
                return (
                  <button
                    key={name}
                    onClick={() => setSelectedSkill(name)}
                    className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden group flex flex-col justify-between min-h-[72px] ${
                      isSelected
                        ? 'bg-gradient-to-br from-sky-500/30 to-blue-600/30 border-sky-400 text-white shadow-lg shadow-sky-500/25 scale-[1.02]'
                        : 'bg-slate-900/80 border-white/10 text-slate-300 hover:border-sky-400/50 hover:bg-slate-800/80 hover:scale-[1.01]'
                    }`}
                  >
                    {/* Glowing highlight indicator */}
                    {isSelected && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-sky-400 animate-ping" />
                    )}

                    <div className="flex items-center gap-2">
                      {getCategoryIcon(category)}
                      <span className="text-xs font-bold leading-tight font-display">
                        {name}
                      </span>
                    </div>

                    <div className="text-[10px] text-slate-400 group-hover:text-sky-300 transition-colors font-mono mt-2">
                      {category.split('&')[0].trim()}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Technology Dossier & Linked Portfolio Projects */}
          <div className="lg:col-span-5 p-4 sm:p-6 overflow-y-auto bg-slate-900/60 flex flex-col justify-between space-y-5">
            <div>
              {/* Active Skill Title & Badge */}
              <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <div className="text-[11px] font-mono text-sky-400 font-bold uppercase tracking-wider">
                    Technical Node Specification
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black font-display text-white mt-1">
                    {selectedSkill}
                  </h3>
                </div>
                <span
                  className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${
                    getSkillProficiency(selectedSkill).badge
                  }`}
                >
                  {getSkillProficiency(selectedSkill).level}
                </span>
              </div>

              {/* Technical Description */}
              <div className="pt-4 text-xs sm:text-sm text-slate-300 leading-relaxed space-y-2">
                <p>
                  Applied across distributed microservice architectures, serverless workflows, cloud automation pipelines, and modern web applications at the University of Jaffna and AWS Student Builder Group.
                </p>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5 space-y-1.5 font-mono text-[11px]">
                  <div className="text-slate-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Architecture Role: Core Implementation</span>
                  </div>
                  <div className="text-slate-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                    <span>Reliability & Standards Compliant</span>
                  </div>
                </div>
              </div>

              {/* Linked Projects Section */}
              <div className="pt-5 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <FolderGit2 className="w-4 h-4 text-amber-400" />
                    <span>Related Projects ({relatedProjects.length})</span>
                  </div>
                  <span className="text-[11px] text-amber-300 font-normal">Click project to inspect</span>
                </div>

                {relatedProjects.length > 0 ? (
                  <div className="space-y-2">
                    {relatedProjects.slice(0, 4).map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          if (onSelectProject) onSelectProject(p);
                        }}
                        className="p-3 rounded-xl bg-slate-950/70 border border-white/10 hover:border-amber-400/60 hover:bg-slate-800/80 transition-all cursor-pointer group flex items-center justify-between gap-3 shadow-md"
                      >
                        <div className="min-w-0">
                          <div className="font-bold text-xs text-white group-hover:text-amber-300 transition-colors truncate">
                            {p.title}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate mt-0.5">
                            {p.shortDescription}
                          </div>
                          <div className="flex items-center gap-1.5 mt-1.5">
                            {p.tech.slice(0, 3).map((t) => (
                              <span
                                key={t}
                                className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-white/5"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-amber-400 transition-colors flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-slate-950/40 border border-white/5 text-center text-xs text-slate-400 font-mono">
                    Foundational skill applied in coursework, SRE research & ongoing prototypes.
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Help Tip */}
            <div className="pt-3 border-t border-white/10 text-[11px] text-slate-400 flex items-center justify-between font-mono">
              <span>⌨️ Use search or tabs to filter</span>
              <button
                onClick={onClose}
                className="text-sky-400 hover:text-white transition font-bold"
              >
                Close Console ✕
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
