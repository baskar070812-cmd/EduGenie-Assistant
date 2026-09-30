import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Brain, 
  MessageSquare, 
  FileText, 
  Route, 
  Compass, 
  CheckCircle2, 
  ShieldCheck, 
  BookOpen, 
  Zap, 
  Award,
  Layers,
  CheckCircle
} from 'lucide-react';
import { AppTab } from '../types';

interface LandingPageProps {
  onNavigate: (tab: AppTab) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const features = [
    {
      id: 'tutor' as AppTab,
      icon: MessageSquare,
      title: 'AI Tutor',
      description: 'Ask any academic question and receive crystal-clear, step-by-step explanations tailored to your learning level.',
      color: 'from-blue-500/20 to-indigo-500/20 text-indigo-400 border-indigo-500/30',
      badge: 'Interactive Q&A'
    },
    {
      id: 'quiz' as AppTab,
      icon: Brain,
      title: 'Smart Quiz',
      description: 'Generate customized knowledge-check quizzes from any subject, difficulty, or your own lecture notes.',
      color: 'from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30',
      badge: 'Active Recall'
    },
    {
      id: 'summarizer' as AppTab,
      icon: FileText,
      title: 'Text Summarizer',
      description: 'Convert dense textbooks, research papers, and lengthy class notes into concise, readable summaries and bullet points.',
      color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30',
      badge: 'Time Saver'
    },
    {
      id: 'learning-path' as AppTab,
      icon: Route,
      title: 'Learning Path',
      description: 'Generate structured week-by-week roadmaps from beginner to mastery with actionable practice milestones.',
      color: 'from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30',
      badge: 'Structured Journey'
    },
    {
      id: 'recommendations' as AppTab,
      icon: Compass,
      title: 'Personalized Recommendations',
      description: 'Receive tailored next steps, focus areas, challenging stretch concepts, and capstone project ideas.',
      color: 'from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30',
      badge: 'Targeted Growth'
    },
    {
      id: 'quiz' as AppTab,
      icon: CheckCircle,
      title: 'Understanding Check',
      description: 'Evaluate your deep comprehension with instant scoring, granular rationales, and constructive feedback.',
      color: 'from-rose-500/20 to-orange-500/20 text-rose-400 border-rose-500/30',
      badge: 'Mastery Assessment'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/20 to-cyan-500/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-6 shadow-sm shadow-indigo-500/10 hover:border-indigo-500/50 transition-colors cursor-default animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Powered by Google Gemini 2.5 AI</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">Next-Gen Education Assistant</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.12] mb-6">
            Learn Smarter. <br />
            <span className="text-gradient">Understand Faster.</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
            EduGenie is your AI-powered learning assistant for explanations, quizzes, summaries, and personalized learning paths.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={() => onNavigate('dashboard')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all hover:shadow-indigo-600/50 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 group"
            >
              <span>Start Learning</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <a
              href="#features"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-semibold text-sm border border-slate-700/60 transition-all hover:border-slate-600 flex items-center justify-center gap-2"
            >
              <span>Explore Features</span>
            </a>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md shadow-xl max-w-3xl mx-auto">
            <div className="text-center p-2">
              <div className="text-2xl font-extrabold text-white">5-in-1</div>
              <div className="text-xs text-slate-400 mt-0.5">Comprehensive Tools</div>
            </div>
            <div className="text-center p-2 border-l border-slate-800">
              <div className="text-2xl font-extrabold text-indigo-400">100%</div>
              <div className="text-xs text-slate-400 mt-0.5">Privacy First Backend</div>
            </div>
            <div className="text-center p-2 border-l border-slate-800">
              <div className="text-2xl font-extrabold text-purple-400">Structured</div>
              <div className="text-xs text-slate-400 mt-0.5">JSON Output Validation</div>
            </div>
            <div className="text-center p-2 border-l border-slate-800">
              <div className="text-2xl font-extrabold text-amber-400">Adaptive</div>
              <div className="text-xs text-slate-400 mt-0.5">Beginner to Advanced</div>
            </div>
          </div>

        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-slate-900/40 border-y border-slate-800/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3">
              Everything You Need to Learn Better
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Powered by AI. Designed for Learning.
            </p>
            <p className="text-slate-400 text-sm sm:text-base mt-4">
              EduGenie replaces cognitive overload with structured pedagogical clarity. Move seamlessly between questions, testing, and roadmaps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-indigo-500/40 p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${feature.color} border flex items-center justify-center group-hover:scale-105 transition-transform`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-400 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700/50">
                        {feature.badge}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed mb-6">
                      {feature.description}
                    </p>
                  </div>

                  <button
                    onClick={() => onNavigate(feature.id)}
                    className="inline-flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-indigo-600 text-slate-200 hover:text-white text-xs font-semibold transition-all group-hover:bg-indigo-600/90"
                  >
                    <span>Open Tool</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Interactive Walkthrough preview */}
      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
              Student Experience
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 mb-3">
              How Students Master Topics with EduGenie
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Combine multiple cognitive tools to move from confusion to complete mastery in four simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-2xl bg-slate-850/60 border border-slate-800 p-5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-sm mb-3">
                1
              </div>
              <h4 className="font-bold text-white text-sm mb-1">Ask the AI Tutor</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Break complex formulas or coding concepts into simple, visual explanations.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-850/60 border border-slate-800 p-5">
              <div className="w-8 h-8 rounded-lg bg-purple-600/20 text-purple-400 flex items-center justify-center font-bold text-sm mb-3">
                2
              </div>
              <h4 className="font-bold text-white text-sm mb-1">Summarize Notes</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Condense 20 pages of dense textbook reading into crisp, memorable bullet points.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-850/60 border border-slate-800 p-5">
              <div className="w-8 h-8 rounded-lg bg-amber-600/20 text-amber-400 flex items-center justify-center font-bold text-sm mb-3">
                3
              </div>
              <h4 className="font-bold text-white text-sm mb-1">Test with Quizzes</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Check your active recall and get instant explanations for every mistake.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-850/60 border border-slate-800 p-5">
              <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold text-sm mb-3">
                4
              </div>
              <h4 className="font-bold text-white text-sm mb-1">Follow Roadmap</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Track your weekly progress and build real capstone projects for your portfolio.
              </p>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-slate-300 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>No signup required • Instant access to all AI features</span>
            </div>
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/25 transition-all"
            >
              Go to Dashboard
            </button>
          </div>

        </div>
      </section>

    </div>
  );
};
