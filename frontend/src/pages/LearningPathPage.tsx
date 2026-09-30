import React, { useState } from 'react';
import { 
  Route, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  Target, 
  Award, 
  Layers, 
  ChevronRight,
  TrendingUp,
  CircleDot
} from 'lucide-react';
import { LearningPathData, LearningStage } from '../types';
import { generateLearningPathApi } from '../api/learningPath';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { loadActiveLearningPath, saveActiveLearningPath } from '../utils/storage';

export const LearningPathPage: React.FC = () => {
  // Form inputs
  const [topic, setTopic] = useState('SQL');
  const [currentLevel, setCurrentLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [studyTime, setStudyTime] = useState<string>('1 hour/day');
  const [duration, setDuration] = useState<string>('8 weeks');

  // Execution state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pathData, setPathData] = useState<LearningPathData>(loadActiveLearningPath());

  const handleGeneratePath = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const data = await generateLearningPathApi({
        topic: topic.trim(),
        current_level: currentLevel,
        study_time: studyTime,
        duration: duration.trim(),
      });
      setPathData(data);
      saveActiveLearningPath(data);
    } catch (err: any) {
      setError(err.message || "Failed to generate learning path. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStageCompletion = (stageNumber: number) => {
    if (!pathData) return;
    const updatedStages = pathData.stages.map(st => {
      if (st.stage_number === stageNumber) {
        return { ...st, completed: !st.completed };
      }
      return st;
    });

    const updatedPath: LearningPathData = {
      ...pathData,
      stages: updatedStages,
    };

    setPathData(updatedPath);
    saveActiveLearningPath(updatedPath);
  };

  const completedCount = pathData?.stages.filter(s => s.completed).length || 0;
  const totalStages = pathData?.stages.length || 1;
  const progressPercent = Math.round((completedCount / totalStages) * 100);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
      
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
          <Route className="w-3.5 h-3.5 text-amber-400" />
          <span>Curriculum Architect</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Learning Path Generator
        </h1>
        <p className="text-slate-400 text-sm mt-2">
          Design an adaptive, step-by-step educational roadmap with clear milestones, practice exercises, and capstone goals.
        </p>
      </div>

      {/* Generator Form */}
      <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 shadow-xl">
        <form onSubmit={handleGeneratePath} className="space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* Topic */}
            <div className="sm:col-span-2 lg:col-span-1">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                What do you want to learn? <span className="text-indigo-400">*</span>
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. SQL, Data Science, Python, Web Dev..."
                required
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Current Level */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Current Level
              </label>
              <select
                value={currentLevel}
                onChange={(e: any) => setCurrentLevel(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            {/* Study Time */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Available Study Time
              </label>
              <select
                value={studyTime}
                onChange={(e) => setStudyTime(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
              >
                <option value="30 minutes/day">30 minutes/day</option>
                <option value="1 hour/day">1 hour/day</option>
                <option value="2 hours/day">2 hours/day</option>
                <option value="3+ hours/day">Custom Intensive</option>
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Target Duration
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 4 weeks, 8 weeks, 12 weeks"
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <span className="text-xs text-slate-400">
              Adapts progression to your pace and prior knowledge
            </span>

            <button
              type="submit"
              disabled={loading || !topic.trim()}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 disabled:opacity-40 text-white font-bold text-xs shadow-lg shadow-amber-600/20 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>Create My Learning Path</span>
            </button>
          </div>

        </form>
      </div>

      {/* Loading */}
      {loading && (
        <LoadingState 
          message="Building your learning roadmap..." 
          subMessage={`Designing a structured curriculum for ${topic} (${duration})`}
          iconType="roadmap"
        />
      )}

      {/* Error */}
      {error && (
        <ErrorMessage message={error} onRetry={handleGeneratePath} />
      )}

      {/* Roadmap Output */}
      {pathData && !loading && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Header & Overall Progress Banner */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                  {pathData.current_level}
                </span>
                <span className="text-xs text-slate-400">• {pathData.study_time}</span>
                <span className="text-xs text-slate-400">• {pathData.duration}</span>
              </div>
              <h2 className="text-2xl font-black text-white">
                {pathData.topic}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Total estimated investment: ~{pathData.estimated_total_hours} study hours across {pathData.stages.length} milestones
              </p>
            </div>

            {/* Progress Counter */}
            <div className="flex items-center gap-4 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
              <div className="text-right">
                <div className="text-xs text-slate-400 font-medium">Roadmap Progress</div>
                <div className="text-xl font-black text-white mt-0.5">
                  {completedCount} <span className="text-xs font-normal text-slate-500">/ {totalStages} Stages</span>
                </div>
              </div>

              <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center relative">
                <span className="text-xs font-extrabold text-amber-400">
                  {progressPercent}%
                </span>
              </div>
            </div>
          </div>

          {/* Visual Timeline Stream */}
          <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-amber-500 before:via-indigo-500 before:to-slate-800">
            {pathData.stages.map((stage) => {
              const isDone = stage.completed;

              return (
                <div 
                  key={stage.stage_number}
                  className="relative group animate-slide-up"
                >
                  {/* Timeline Node Dot */}
                  <button
                    onClick={() => handleToggleStageCompletion(stage.stage_number)}
                    className={`absolute -left-6 sm:-left-8 top-5 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all ${
                      isDone 
                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' 
                        : 'bg-slate-900 border-2 border-amber-500/80 text-amber-400 hover:bg-amber-500/20'
                    }`}
                    title="Click to toggle stage completion"
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <span className="text-xs font-extrabold">{stage.stage_number}</span>
                    )}
                  </button>

                  {/* Stage Card */}
                  <div className={`rounded-2xl p-6 border transition-all ${
                    isDone 
                      ? 'bg-slate-900/60 border-emerald-500/30 shadow-md shadow-emerald-500/5' 
                      : 'bg-slate-900/80 border-slate-800 hover:border-amber-500/40 shadow-lg'
                  }`}>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                            Stage {stage.stage_number}
                          </span>
                          <span className="text-xs text-slate-500">•</span>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-500" />
                            {stage.estimated_time}
                          </span>
                        </div>
                        <h3 className={`text-lg font-bold mt-1 ${isDone ? 'text-emerald-300 line-through' : 'text-white'}`}>
                          {stage.title}
                        </h3>
                      </div>

                      <button
                        onClick={() => handleToggleStageCompletion(stage.stage_number)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition-colors ${
                          isDone 
                            ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300' 
                            : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{isDone ? 'Completed' : 'Mark Complete'}</span>
                      </button>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed my-4">
                      {stage.description}
                    </p>

                    {/* Topics Chips */}
                    <div className="mb-4">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Topics Covered:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {stage.topics.map((t, idx) => (
                          <span 
                            key={idx}
                            className="px-2.5 py-1 rounded-md bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Objectives & Recommended Practice */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-800/80 text-xs">
                      
                      {/* Objectives */}
                      <div className="space-y-1.5">
                        <div className="font-semibold text-slate-300 flex items-center gap-1.5">
                          <Target className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Learning Objectives</span>
                        </div>
                        <ul className="space-y-1 text-slate-400 pl-1">
                          {stage.learning_objectives.map((obj, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="text-indigo-400 font-bold">•</span>
                              <span>{obj}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Practice */}
                      <div className="space-y-1.5">
                        <div className="font-semibold text-slate-300 flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-amber-400" />
                          <span>Recommended Practice</span>
                        </div>
                        <ul className="space-y-1 text-slate-400 pl-1">
                          {stage.recommended_practice.map((prac, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="text-amber-400 font-bold">•</span>
                              <span>{prac}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                    </div>

                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
};
