import React from 'react';
import { X, MapPin, Compass, Award, Cloud, Cpu, ArrowRight } from 'lucide-react';

interface JourneyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JourneyModal: React.FC<JourneyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const steps = [
    {
      title: '1. Colombo Roots & Academic Journey at University of Jaffna',
      subtitle: 'Colombo Hometown & B.Sc. Hons in Computer Science',
      description:
        'Hailing from my hometown of Colombo, Sri Lanka, I pursued my academic journey in Computer Science at the University of Jaffna. Grounded in core data structures, algorithms, and systems engineering.',
      icon: MapPin,
      color: '#38bdf8',
      tag: 'Origins & Academics',
    },
    {
      title: '2. Code, Hackathons & Open Source',
      subtitle: 'Building Real-World Software',
      description:
        'Pivoted theoretical foundations into competitive programming (Two-Time UOJ Coders Finalist, HackForce 25 Winners) and open-source contributions to WSO2 OpenChoreo (Go) and GirlScript AnimateItNow.',
      icon: Compass,
      color: '#10b981',
      tag: 'Hands-on Growth',
    },
    {
      title: '3. AWS Student Builder Leadership & IEEE Volunteering',
      subtitle: 'Mobilizing 600+ Student Builders & IEEE StudPro 9.0 Leadership',
      description:
        'Founded the AWS Student Builder Group at the University of Jaffna, growing a thriving community of more than 600 members with hands-on bootcamps and workshops. Active IEEE volunteer currently serving as Project Vice Chair, Finance & Partnerships, for IEEE StudPro 9.0.',
      icon: Cloud,
      color: '#ff9900',
      tag: 'Community Leader',
    },
    {
      title: '4. Cloud Architecture & System Reliability',
      subtitle: 'Exploring DevOps, Distributed Systems & Observability',
      description:
        'Diving deep into Site Reliability Engineering principles, telemetry analysis, container orchestration with Kubernetes, and resilient microservice architectures.',
      icon: Cpu,
      color: '#8b5cf6',
      tag: 'Cloud & Reliability',
    },
    {
      title: '5. Global Cloud Engineering Horizons',
      subtitle: 'Reliable, Scalable, Distributed Systems',
      description:
        'Certified as an AWS Cloud Practitioner and AWS New Voices 2026 speaker. Committed to designing, deploying, and operating high-availability cloud-native microservice systems.',
      icon: Award,
      color: '#ec4899',
      tag: 'Future Vision',
    },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl glass-panel border border-slate-700/80 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/60 bg-slate-900/80">
          <div>
            <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
              From Sri Lanka to the Cloud
              <span className="text-xs px-2.5 py-0.5 rounded-full font-mono bg-sky-500/20 text-sky-300 border border-sky-500/30">
                Personal Journey
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              The milestones shaping Pamuda's path from a Sri Lankan undergraduate to a cloud builder.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          <div className="relative border-l-2 border-slate-700/80 ml-4 space-y-8 pl-6 my-2">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="relative group">
                  {/* Timeline Dot */}
                  <div
                    className="absolute -left-[35px] top-1 w-6 h-6 rounded-full flex items-center justify-center shadow-lg"
                    style={{ backgroundColor: step.color }}
                  >
                    <Icon className="w-3.5 h-3.5 text-slate-950" />
                  </div>

                  {/* Card Content */}
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition">
                    <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                      <h3 className="font-bold text-white text-base">{step.title}</h3>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        {step.tag}
                      </span>
                    </div>
                    <div className="text-xs text-sky-400 font-medium mb-2">{step.subtitle}</div>
                    <p className="text-xs text-slate-300 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-700/60 bg-slate-900/80 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            "Build. Explore. Deploy."
          </div>
          <button
            onClick={onClose}
            className="btn-primary text-xs py-2 px-5"
          >
            Explore Pamuda's World
          </button>
        </div>
      </div>
    </div>
  );
};
