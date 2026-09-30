import React from 'react';
import { Sparkles, Brain, BookOpen, Route, Compass } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  subMessage?: string;
  iconType?: 'chat' | 'quiz' | 'summary' | 'roadmap' | 'recommend';
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = "EduGenie is processing...",
  subMessage = "Crafting high-quality academic insights using Google Gemini AI",
  iconType = 'chat'
}) => {
  const renderIcon = () => {
    switch (iconType) {
      case 'quiz':
        return <Brain className="w-8 h-8 text-indigo-400 animate-pulse" />;
      case 'summary':
        return <BookOpen className="w-8 h-8 text-indigo-400 animate-pulse" />;
      case 'roadmap':
        return <Route className="w-8 h-8 text-indigo-400 animate-pulse" />;
      case 'recommend':
        return <Compass className="w-8 h-8 text-indigo-400 animate-pulse" />;
      default:
        return <Sparkles className="w-8 h-8 text-indigo-400 animate-pulse" />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center animate-fade-in my-6">
      <div className="relative mb-5">
        <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shadow-lg shadow-indigo-500/10">
          {renderIcon()}
        </div>
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 opacity-30 blur-md animate-pulse"></div>
      </div>
      
      <h3 className="text-lg font-semibold text-slate-100 mb-1.5 flex items-center gap-2">
        {message}
      </h3>
      <p className="text-sm text-slate-400 max-w-md">
        {subMessage}
      </p>

      {/* Progress dots animation */}
      <div className="flex items-center gap-1.5 mt-4">
        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
};
