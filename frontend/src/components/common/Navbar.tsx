import React, { useState } from 'react';
import { 
  GraduationCap, 
  Sparkles, 
  Menu, 
  X, 
  MessageSquare, 
  Brain, 
  FileText, 
  Route, 
  Compass, 
  Info, 
  LayoutDashboard,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { AppTab, SystemStatus } from '../../types';

interface NavbarProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  status: SystemStatus | null;
  onOpenConfig: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  status,
  onOpenConfig,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home' as AppTab, label: 'Home' },
    { id: 'dashboard' as AppTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tutor' as AppTab, label: 'AI Tutor', icon: MessageSquare },
    { id: 'quiz' as AppTab, label: 'Quiz Generator', icon: Brain },
    { id: 'summarizer' as AppTab, label: 'Summarizer', icon: FileText },
    { id: 'learning-path' as AppTab, label: 'Learning Path', icon: Route },
    { id: 'recommendations' as AppTab, label: 'Recommendations', icon: Compass },
    { id: 'about' as AppTab, label: 'About', icon: Info },
  ];

  const handleNavClick = (tab: AppTab) => {
    onTabChange(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <button 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 group focus:outline-none"
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-200">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <Sparkles className="w-3.5 h-3.5 text-amber-300 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-indigo-200 transition-colors">
                Edu<span className="text-indigo-400">Genie</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase -mt-1">
                Gemini Powered
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Actions & Status Badge */}
          <div className="hidden md:flex items-center gap-3">
            {/* Status pill button */}
            <button
              onClick={onOpenConfig}
              className={`px-2.5 py-1 rounded-full text-xs font-medium border flex items-center gap-1.5 transition-all hover:scale-102 ${
                status?.gemini_configured
                  ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/50'
                  : 'bg-indigo-950/40 border-indigo-500/30 text-indigo-300 hover:bg-indigo-900/50'
              }`}
              title="Click to view Gemini API status and configuration"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>{status?.gemini_model || 'Gemini 2.5'}</span>
              <span className={`w-1.5 h-1.5 rounded-full ${status?.gemini_configured ? 'bg-emerald-400 animate-pulse' : 'bg-indigo-400'}`} />
            </button>

            {/* Get Started CTA */}
            {activeTab === 'home' ? (
              <button
                onClick={() => handleNavClick('dashboard')}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/25 transition-all hover:shadow-indigo-600/40 hover:-translate-y-0.5 active:translate-y-0"
              >
                Get Started
              </button>
            ) : (
              <button
                onClick={() => handleNavClick('tutor')}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-all hover:-translate-y-0.5"
              >
                Ask Tutor
              </button>
            )}
          </div>

          {/* Mobile hamburger menu button */}
          <div className="flex xl:hidden items-center gap-2">
            <button
              onClick={onOpenConfig}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              title="Config"
            >
              <Cpu className="w-5 h-5 text-indigo-400" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-b border-slate-800 bg-slate-900/95 backdrop-blur-2xl px-4 pt-2 pb-6 space-y-2 animate-slide-up">
          <div className="grid grid-cols-2 gap-2 pt-2 pb-3">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon || Sparkles;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-slate-800/70 text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => { onOpenConfig(); setMobileMenuOpen(false); }}
              className="text-xs text-indigo-400 flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Model: {status?.gemini_model || 'gemini-2.5-flash'}</span>
            </button>

            <button
              onClick={() => handleNavClick('dashboard')}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md"
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
