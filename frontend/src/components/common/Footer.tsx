import React from 'react';
import { GraduationCap, Sparkles, Heart, Shield, Cpu } from 'lucide-react';
import { AppTab } from '../../types';

interface FooterProps {
  onTabChange: (tab: AppTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onTabChange }) => {
  return (
    <footer className="w-full border-t border-slate-850 bg-slate-950/90 text-slate-400 py-12 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        
        {/* Brand column */}
        <div className="space-y-4 md:col-span-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-600/20">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-xl text-white tracking-tight">
              Edu<span className="text-indigo-400">Genie</span>
            </span>
          </div>
          <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
            AI-powered learning assistant for students. Simplifies difficult concepts, generates quizzes, summarizes study material, and guides personalized learning journeys.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              Powered by Google Gemini
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              Secure API Architecture
            </span>
          </div>
        </div>

        {/* Learning Tools */}
        <div>
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
            Learning Tools
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <button onClick={() => onTabChange('tutor')} className="hover:text-indigo-300 transition-colors">
                AI Tutor (Q&A)
              </button>
            </li>
            <li>
              <button onClick={() => onTabChange('quiz')} className="hover:text-indigo-300 transition-colors">
                Smart Quiz Generator
              </button>
            </li>
            <li>
              <button onClick={() => onTabChange('summarizer')} className="hover:text-indigo-300 transition-colors">
                Text Summarizer
              </button>
            </li>
            <li>
              <button onClick={() => onTabChange('learning-path')} className="hover:text-indigo-300 transition-colors">
                Learning Path Roadmap
              </button>
            </li>
            <li>
              <button onClick={() => onTabChange('recommendations')} className="hover:text-indigo-300 transition-colors">
                Personalized Recommendations
              </button>
            </li>
          </ul>
        </div>

        {/* Platform Links */}
        <div>
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
            EduGenie
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <button onClick={() => onTabChange('home')} className="hover:text-indigo-300 transition-colors">
                Home
              </button>
            </li>
            <li>
              <button onClick={() => onTabChange('dashboard')} className="hover:text-indigo-300 transition-colors">
                Student Dashboard
              </button>
            </li>
            <li>
              <button onClick={() => onTabChange('about')} className="hover:text-indigo-300 transition-colors">
                About EduGenie
              </button>
            </li>
            <li>
              <a 
                href="https://aistudio.google.com/" 
                target="_blank" 
                rel="noreferrer" 
                className="hover:text-indigo-300 transition-colors flex items-center gap-1"
              >
                Google AI Studio <Sparkles className="w-3 h-3 text-amber-400" />
              </a>
            </li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
        <p>© 2026 EduGenie. Built for smarter, faster learning with Google Gemini.</p>
        <p className="flex items-center gap-1 text-slate-400">
          Designed with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for curious students everywhere
        </p>
      </div>
    </footer>
  );
};
