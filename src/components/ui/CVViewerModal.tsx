import React from 'react';
import {
  X,
  Download,
  FileText,
  ExternalLink,
  Mail,
  GraduationCap,
  Award,
  CheckCircle2,
} from 'lucide-react';
import { siteConfig } from '../../data/siteConfig';

interface CVViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CVViewerModal: React.FC<CVViewerModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const cvPdfUrl = '/cv/Pamuda-Sep-2026-public.pdf';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fade-in font-body">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-slate-900/95 border border-sky-400/30 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(56,189,248,0.2)] flex flex-col overflow-hidden text-slate-100">
        
        {/* Header HUD */}
        <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between gap-4 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-display font-extrabold text-base sm:text-lg text-white flex items-center gap-2">
                Official Curriculum Vitae
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                  Verified Academic Record
                </span>
              </div>
              <div className="text-xs text-slate-400">
                Pamuda U. de A. Goonatilake • University of Jaffna & AWS SBG Leader
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={cvPdfUrl}
              download="Pamuda_Goonatilake_CV.pdf"
              className="btn-primary text-xs py-2 px-4 flex items-center gap-2 shadow-lg"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </a>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition border border-white/5"
              aria-label="Close CV viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-950/20">
          
          {/* Executive Summary Card */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
              <div>
                <h3 className="text-lg font-bold font-display text-white">
                  Pamuda U. de A. Goonatilake
                </h3>
                <p className="text-xs text-sky-300 font-medium mt-0.5">
                  Computer Science Undergraduate | Cloud, DevOps & SRE Enthusiast
                </p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-xs text-slate-200 hover:text-white hover:bg-slate-700 transition flex items-center gap-1.5 border border-white/5"
                >
                  <Mail className="w-3.5 h-3.5 text-sky-400" />
                  <span>Email</span>
                </a>
                <a
                  href={siteConfig.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-xs text-slate-200 hover:text-white hover:bg-slate-700 transition flex items-center gap-1.5 border border-white/5"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                  <span>GitHub</span>
                </a>
              </div>
            </div>

            {/* Quick Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5 space-y-1">
                <div className="flex items-center gap-1.5 text-sky-400 font-bold font-mono">
                  <GraduationCap className="w-4 h-4" />
                  <span>Education</span>
                </div>
                <div className="text-slate-200 font-semibold">B.Sc. Hons in CS</div>
                <div className="text-[11px] text-slate-400">University of Jaffna (2023 - 2027)</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5 space-y-1">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold font-mono">
                  <Award className="w-4 h-4" />
                  <span>Leadership</span>
                </div>
                <div className="text-slate-200 font-semibold">AWS SBG Leader</div>
                <div className="text-[11px] text-slate-400">Founding Leader, UOJ Chapter</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold font-mono">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Hackathons</span>
                </div>
                <div className="text-slate-200 font-semibold">HackForce '25 Winner</div>
                <div className="text-[11px] text-slate-400">Two-time UOJ Coders Finalist</div>
              </div>
            </div>
          </div>

          {/* Embedded PDF Frame / Fallback */}
          <div className="rounded-2xl border border-white/10 overflow-hidden bg-slate-950 shadow-inner min-h-[480px] flex flex-col">
            <iframe
              src={`${cvPdfUrl}#toolbar=0&navpanes=0`}
              title="Pamuda Goonatilake Curriculum Vitae"
              className="w-full h-[520px] rounded-2xl border-0"
            />
            
            {/* Fallback Direct Action bar */}
            <div className="p-3 bg-slate-900/90 border-t border-white/5 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>PDF preview rendering above</span>
              <a
                href={cvPdfUrl}
                download="Pamuda_Goonatilake_CV.pdf"
                className="text-sky-400 hover:text-white transition flex items-center gap-1 font-bold"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save to Device</span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <span>Prepared for AWS Student Builder Challenge & Internship Applications</span>
          <button
            onClick={onClose}
            className="text-sky-400 hover:text-white transition font-semibold"
          >
            Return to CloudVerse ✕
          </button>
        </div>
      </div>
    </div>
  );
};
