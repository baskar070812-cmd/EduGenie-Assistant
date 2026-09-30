import React from 'react';
import { 
  GraduationCap, 
  Sparkles, 
  ShieldCheck, 
  Cpu, 
  Layers, 
  Lock, 
  Server, 
  Layout, 
  CheckCircle2, 
  ArrowRight,
  Brain,
  FileText,
  Route,
  Compass,
  MessageSquare
} from 'lucide-react';
import { AppTab } from '../types';

interface AboutPageProps {
  onNavigate: (tab: AppTab) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in space-y-12">
      
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>About the Platform</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          What is EduGenie?
        </h1>
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
          EduGenie is a lightweight AI-powered educational assistant designed to simplify learning using Google Gemini. It bridges the gap between raw educational content and true student comprehension.
        </p>
      </div>

      {/* Core Mission Card */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/30 to-slate-900 border border-slate-800 p-8 shadow-2xl space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
            <GraduationCap className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              The Learning Problem EduGenie Solves
            </h2>
            <p className="text-xs text-slate-400">
              Transforming passive memorization into active, structured understanding
            </p>
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed">
          Students frequently face cognitive fatigue when confronting dense textbooks, abstract scientific formulas, or intricate code architectures. Rather than acting as a generic conversational chatbot, <strong>EduGenie is architected as an academic companion</strong> that equips learners with purpose-built cognitive tools: interactive tutoring, active recall quizzes, text condensation, and long-term roadmap tracking.
        </p>
      </div>

      {/* 6 Main Capabilities Grid */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl font-bold text-white">Main Capabilities</h2>
          <p className="text-xs text-slate-400 mt-1">Five integrated tools designed for academic excellence</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5 space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">AI-Powered Q&A</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ask academic questions and receive intuitive explanations tailored to your current study level.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5 space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Simplified Explanations</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Break complicated formulas and abstract logic into bite-sized analogies and step-by-step guides.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5 space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Brain className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Quiz Generation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generate structured multiple-choice and true/false assessments with instant grading and explanations.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5 space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Text Summarization</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Condense long lecture notes, papers, or articles into concise overviews and high-impact key takeaways.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5 space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Route className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Learning Paths</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Follow chronological timelines from beginner fundamentals through capstone portfolio projects.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5 space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Personalized Recommendations</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Identify hidden knowledge gaps, discover stretch challenge topics, and focus on practical exercises.
            </p>
          </div>
        </div>
      </div>

      {/* Technology Stack & Security Architecture */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-8 shadow-xl space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Server className="w-5 h-5 text-indigo-400" />
          <span>Technology & Security Architecture</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300">
          <div className="space-y-3 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <h3 className="font-bold text-indigo-300 text-sm flex items-center gap-1.5">
              <Layout className="w-4 h-4 text-indigo-400" />
              <span>Frontend Architecture</span>
            </h3>
            <ul className="space-y-1.5 text-slate-400 pl-1">
              <li>• <strong>React 19 + TypeScript:</strong> Type-safe interactive user interface.</li>
              <li>• <strong>Vite:</strong> Ultra-fast modern bundler with development proxy.</li>
              <li>• <strong>Tailwind CSS:</strong> Polished academic dark SaaS aesthetic.</li>
              <li>• <strong>Lucide React:</strong> Clean, consistent iconography.</li>
              <li>• <strong>LocalStorage:</strong> Non-sensitive client persistence for progress.</li>
            </ul>
          </div>

          <div className="space-y-3 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <h3 className="font-bold text-indigo-300 text-sm flex items-center gap-1.5">
              <Server className="w-4 h-4 text-indigo-400" />
              <span>Backend & AI Architecture</span>
            </h3>
            <ul className="space-y-1.5 text-slate-400 pl-1">
              <li>• <strong>FastAPI (Python 3.12):</strong> High-performance async REST API.</li>
              <li>• <strong>Pydantic v2:</strong> Strict request/response validation and schemas.</li>
              <li>• <strong>Google GenAI SDK:</strong> Official current Google Gemini client.</li>
              <li>• <strong>Structured JSON:</strong> Guaranteed schema parsing for quizzes & paths.</li>
              <li>• <strong>CORS:</strong> Secure cross-origin resource sharing protection.</li>
            </ul>
          </div>
        </div>

        {/* Security Highlight */}
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-200 text-xs">
          <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold text-emerald-100">Zero Client-Side Key Exposure: </span>
            The Gemini API key is never bundled in frontend JavaScript. All requests travel from the client to the FastAPI server, where the official Google GenAI SDK communicates with Google's servers over TLS.
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="text-center p-8 rounded-3xl bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-indigo-900/40 border border-indigo-500/30 shadow-xl space-y-4">
        <h2 className="text-2xl font-bold text-white">Ready to elevate your learning?</h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
          Start asking questions or generate your very first custom active-recall quiz in seconds.
        </p>
        <button
          onClick={() => onNavigate('dashboard')}
          className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all inline-flex items-center gap-2"
        >
          <span>Open Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
