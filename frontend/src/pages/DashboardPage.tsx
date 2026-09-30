import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Brain, 
  Award, 
  TrendingUp, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Compass, 
  BookOpen, 
  Sparkles,
  ChevronRight,
  Route
} from 'lucide-react';
import { AppTab, LearningPathData } from '../types';
import { loadUserStats, loadActiveLearningPath, UserStats } from '../utils/storage';
import { DEMO_RECOMMENDATIONS } from '../utils/demoData';

interface DashboardPageProps {
  onNavigate: (tab: AppTab) => void;
  onSelectTopic?: (topic: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate, onSelectTopic }) => {
  const [stats, setStats] = useState<UserStats>(loadUserStats());
  const [activePath, setActivePath] = useState<LearningPathData>(loadActiveLearningPath());

  useEffect(() => {
    setStats(loadUserStats());
    setActivePath(loadActiveLearningPath());
  }, []);

  const avgScore = stats.totalPossibleScore > 0 
    ? Math.round((stats.totalScore / stats.totalPossibleScore) * 100) 
    : 80;

  const completedStages = activePath.stages.filter(s => s.completed).length;
  const currentStage = activePath.stages.find(s => !s.completed) || activePath.stages[0];

  const recentActivities = [
    {
      icon: Brain,
      title: "Completed Python Quiz",
      time: "2 hours ago",
      tag: "Quiz",
      tagColor: "bg-purple-950/60 text-purple-300 border-purple-800/40",
      actionTab: 'quiz' as AppTab
    },
    {
      icon: MessageSquare,
      title: "Asked about Data Structures (Binary Trees)",
      time: "Yesterday",
      tag: "AI Tutor",
      tagColor: "bg-blue-950/60 text-blue-300 border-blue-800/40",
      actionTab: 'tutor' as AppTab
    },
    {
      icon: Route,
      title: "Generated SQL Learning Path",
      time: "2 days ago",
      tag: "Roadmap",
      tagColor: "bg-amber-950/60 text-amber-300 border-amber-800/40",
      actionTab: 'learning-path' as AppTab
    },
    {
      icon: BookOpen,
      title: "Summarized Computer Networks notes",
      time: "3 days ago",
      tag: "Summary",
      tagColor: "bg-emerald-950/60 text-emerald-300 border-emerald-800/40",
      actionTab: 'summarizer' as AppTab
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
      
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Academic Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Welcome back to EduGenie 👋
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-xl">
            You're currently mastering <span className="text-indigo-300 font-semibold">{activePath.topic}</span>. Keep up your daily study streak!
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <button
            onClick={() => onNavigate('tutor')}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Ask a Question</span>
          </button>
          <button
            onClick={() => onNavigate('quiz')}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all flex items-center gap-1.5"
          >
            <Brain className="w-3.5 h-3.5 text-purple-400" />
            <span>Take a Quiz</span>
          </button>
        </div>
      </div>

      {/* Learning Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Questions Asked */}
        <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5 hover:border-indigo-500/40 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Questions Asked</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {stats.questionsAsked}
          </div>
          <div className="text-xs text-indigo-400 font-medium flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>Active learning inquiries</span>
          </div>
        </div>

        {/* Quizzes Completed */}
        <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5 hover:border-purple-500/40 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Quizzes Completed</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Brain className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {stats.quizzesCompleted}
          </div>
          <div className="text-xs text-purple-400 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Active recall sessions</span>
          </div>
        </div>

        {/* Average Quiz Score */}
        <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5 hover:border-amber-500/40 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Average Quiz Score</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {avgScore}%
          </div>
          <div className="text-xs text-amber-400 font-medium flex items-center gap-1">
            <span>High comprehension tier</span>
          </div>
        </div>

        {/* Learning Progress */}
        <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5 hover:border-emerald-500/40 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Learning Progress</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {stats.learningProgressPercent}%
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
            <div 
              className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500" 
              style={{ width: `${stats.learningProgressPercent}%` }}
            />
          </div>
        </div>

      </div>

      {/* Main Content Grid: Continue Learning & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Continue Learning Card (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Route className="w-4 h-4 text-indigo-400" />
              <span>Continue Learning</span>
            </h2>
            <button
              onClick={() => onNavigate('learning-path')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
            >
              <span>View Full Roadmap</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 relative overflow-hidden shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
              <div>
                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                  Active Roadmap
                </span>
                <h3 className="text-xl font-bold text-white mt-1">
                  {activePath.topic}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Stage {currentStage?.stage_number || 1} of {activePath.stages.length} • {activePath.study_time}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs text-slate-400">Stages Done</div>
                  <div className="text-sm font-bold text-white">
                    {completedStages} / {activePath.stages.length}
                  </div>
                </div>
                <button
                  onClick={() => onNavigate('learning-path')}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  <span>Resume Stage</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Current Stage Details */}
            {currentStage && (
              <div className="pt-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-300">
                    Up Next: {currentStage.title}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {currentStage.estimated_time}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {currentStage.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {currentStage.topics.map((t, idx) => (
                    <span 
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-[11px] font-medium border border-slate-700/60"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Recommended For You Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Compass className="w-4 h-4 text-cyan-400" />
                <span>Recommended For You</span>
              </h2>
              <button
                onClick={() => onNavigate('recommendations')}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
              >
                <span>All Suggestions</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 hover:border-cyan-500/40 transition-colors">
                <div className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950/60 text-cyan-300 border border-cyan-800/40 mb-2">
                  Continue Learning
                </div>
                <h4 className="text-sm font-bold text-white mb-1">
                  {DEMO_RECOMMENDATIONS.continue_learning.title}
                </h4>
                <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                  {DEMO_RECOMMENDATIONS.continue_learning.description}
                </p>
                <button
                  onClick={() => onNavigate('tutor')}
                  className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1"
                >
                  Explore with AI Tutor <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 hover:border-amber-500/40 transition-colors">
                <div className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950/60 text-amber-300 border border-amber-800/40 mb-2">
                  Strengthen Knowledge
                </div>
                <h4 className="text-sm font-bold text-white mb-1">
                  {DEMO_RECOMMENDATIONS.strengthen_knowledge.title}
                </h4>
                <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                  {DEMO_RECOMMENDATIONS.strengthen_knowledge.description}
                </p>
                <button
                  onClick={() => onNavigate('quiz')}
                  className="text-xs font-semibold text-amber-400 hover:text-amber-300 inline-flex items-center gap-1"
                >
                  Take Practice Quiz <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Recent Activity Sidebar (1 Col) */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>Recent Activity</span>
          </h2>

          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 space-y-4 shadow-lg">
            {recentActivities.map((act, idx) => {
              const Icon = act.icon;
              return (
                <div 
                  key={idx}
                  onClick={() => onNavigate(act.actionTab)}
                  className="p-3 rounded-xl bg-slate-850/50 hover:bg-slate-800 border border-slate-800/80 hover:border-slate-700 transition-all cursor-pointer group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 group-hover:text-indigo-400 group-hover:bg-indigo-500/10 transition-colors flex-shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors truncate">
                        {act.title}
                      </h4>
                      <div className="flex items-center justify-between mt-1 text-[11px]">
                        <span className="text-slate-500">{act.time}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${act.tagColor}`}>
                          {act.tag}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="pt-3 border-t border-slate-800/80 text-center">
              <span className="text-[11px] text-slate-500">
                Activity is automatically recorded locally.
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
