import React, { useState } from 'react';
import {
  X,
  Bookmark,
  Calendar,
  Clock,
  ExternalLink,
  BookOpen,
  Tag,
  CheckCircle2,
  FileCode,
} from 'lucide-react';
import { journalArticles } from '../../data/journal';
import { JournalArticle } from '../../types';
import { sortDescByDate, parseDateToScore } from '../../utils/sorting';

interface CloudJournalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CloudJournalModal: React.FC<CloudJournalModalProps> = ({
  isOpen,
  onClose,
}) => {
  const sortedArticles = React.useMemo(() => {
    return sortDescByDate(journalArticles, (a) => parseDateToScore(a.date));
  }, []);

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedArticle, setSelectedArticle] = useState<JournalArticle>(sortedArticles[0] || journalArticles[0]);

  if (!isOpen) return null;

  const categories = ['All', 'Technical Article', 'Industry Analysis', 'Cloud Architecture'];

  const filteredArticles = selectedCategory === 'All'
    ? sortedArticles
    : sortedArticles.filter((a) => a.category === selectedCategory);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fade-in font-body">
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-slate-900/95 border border-sky-400/30 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(56,189,248,0.2)] flex flex-col overflow-hidden text-slate-100">
        
        {/* Header HUD */}
        <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between gap-4 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-display font-extrabold text-base sm:text-lg text-white flex items-center gap-2">
                Publications & Technical Writing
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/40">
                  Verified Articles
                </span>
              </div>
              <div className="text-xs text-slate-400">
                Articles, technical writing, cloud architecture insights, and community publications
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition border border-white/5"
            aria-label="Close journal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Pills Bar */}
        <div className="p-3 sm:p-4 border-b border-white/10 bg-slate-950/40 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Main Content Split: Article Selector (Left) + Detail Reader (Right) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          
          {/* Left Column: Article List */}
          <div className="lg:col-span-5 p-4 sm:p-5 overflow-y-auto border-b lg:border-b-0 lg:border-r border-white/10 space-y-3 bg-slate-950/20">
            <div className="text-[11px] font-mono uppercase text-slate-400 tracking-wider">
              Publications & Papers ({filteredArticles.length})
            </div>

            {filteredArticles.map((article) => {
              const isSelected = selectedArticle.id === article.id;
              return (
                <div
                  key={article.id}
                  onClick={() => setSelectedArticle(article)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 group ${
                    isSelected
                      ? 'bg-gradient-to-br from-blue-900/40 to-slate-900/90 border-blue-400 shadow-lg text-white'
                      : 'bg-slate-900/60 border-white/5 text-slate-300 hover:border-blue-400/40 hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-blue-300 font-bold px-2 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30">
                      {article.category}
                    </span>
                    <span className="text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.readTime}
                    </span>
                  </div>

                  <h4 className="font-display font-bold text-sm text-white group-hover:text-blue-200 transition-colors leading-snug">
                    {article.title}
                  </h4>

                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {article.abstract}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right Column: Full Abstract & Research Highlights */}
          <div className="lg:col-span-7 p-5 sm:p-7 overflow-y-auto bg-slate-900/60 space-y-6">
            <div className="space-y-3 border-b border-white/10 pb-5">
              <div className="flex items-center gap-2 text-xs font-mono text-blue-400 font-semibold">
                <Bookmark className="w-4 h-4" />
                <span>{selectedArticle.category}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-400">
                  <Calendar className="w-3 h-3" />
                  {selectedArticle.date}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black font-display text-white leading-tight">
                {selectedArticle.title}
              </h3>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {selectedArticle.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-slate-800/80 border border-white/10 text-slate-300 flex items-center gap-1"
                  >
                    <Tag className="w-2.5 h-2.5 text-blue-400" />
                    <span>{tag}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Abstract Section */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider">
                Abstract & Problem Statement
              </h4>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-950/60 p-4 rounded-2xl border border-white/5 font-sans">
                {selectedArticle.abstract}
              </p>
            </div>

            {/* Key Contributions & Findings */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                Key Contributions & Findings
              </h4>
              <div className="space-y-2">
                {selectedArticle.highlights.map((h, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-slate-950/40 border border-white/5 flex items-start gap-2.5 text-xs text-slate-300"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Link out */}
            {selectedArticle.link && (
              <div className="pt-2">
                <a
                  href={selectedArticle.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-xs py-2.5 px-5 inline-flex items-center gap-2 shadow-lg"
                >
                  <FileCode className="w-4 h-4" />
                  <span>Inspect Source & Repository</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
