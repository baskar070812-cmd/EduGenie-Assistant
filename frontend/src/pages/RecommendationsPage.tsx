import React, { useState } from 'react';
import { 
  Compass, 
  Sparkles, 
  ArrowRight, 
  AlertCircle, 
  Lightbulb, 
  ShieldAlert, 
  Rocket, 
  CheckCircle2, 
  Flame, 
  Hammer,
  Code,
  Layers
} from 'lucide-react';
import { RecommendationData } from '../types';
import { generateRecommendationsApi } from '../api/recommendations';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { DEMO_RECOMMENDATIONS } from '../utils/demoData';

export const RecommendationsPage: React.FC = () => {
  const [learningTopic, setLearningTopic] = useState('SQL & Relational Databases');
  const [currentLevel, setCurrentLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [completedTopics, setCompletedTopics] = useState('Basic SELECT, WHERE filters, Single table aggregations');
  const [goals, setGoals] = useState('Become a confident full-stack engineer and ace technical interviews');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recData, setRecData] = useState<RecommendationData>(DEMO_RECOMMENDATIONS);

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!learningTopic.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const data = await generateRecommendationsApi({
        learning_topic: learningTopic.trim(),
        current_level: currentLevel,
        completed_topics: completedTopics.trim() || undefined,
        goals: goals.trim() || undefined,
      });
      setRecData(data);
    } catch (err: any) {
      setError(err.message || "Failed to generate recommendations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
      
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-3">
          <Compass className="w-3.5 h-3.5 text-cyan-400" />
          <span>Strategic Learning Advisor</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Personalized Recommendations
        </h1>
        <p className="text-slate-400 text-sm mt-2">
          Tailored study recommendations based on your current knowledge, skill gaps, and long-term academic targets.
        </p>
      </div>

      {/* Profile Input Form */}
      <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 shadow-xl">
        <form onSubmit={handleGenerate} className="space-y-5">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Learning Topic */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                What are you currently learning? <span className="text-indigo-400">*</span>
              </label>
              <input
                type="text"
                value={learningTopic}
                onChange={(e) => setLearningTopic(e.target.value)}
                placeholder="e.g. Python, SQL, Organic Chemistry, Linear Algebra..."
                required
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Current Level */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                What is your current level?
              </label>
              <select
                value={currentLevel}
                onChange={(e: any) => setCurrentLevel(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="Beginner">Beginner (Foundations)</option>
                <option value="Intermediate">Intermediate (Building & Applying)</option>
                <option value="Advanced">Advanced (Architecting & Optimizing)</option>
              </select>
            </div>

            {/* Completed Topics */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Topics already completed
              </label>
              <input
                type="text"
                value={completedTopics}
                onChange={(e) => setCompletedTopics(e.target.value)}
                placeholder="e.g. Syntax, Loops, Basic SELECT, Arrays..."
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Learning Goals */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                What are your learning goals?
              </label>
              <input
                type="text"
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                placeholder="e.g. Pass exam, build SaaS app, land software internship..."
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            <span className="text-xs text-slate-400">
              Gemini analyzes prerequisites and industry patterns
            </span>

            <button
              type="submit"
              disabled={loading || !learningTopic.trim()}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-40 text-white font-bold text-xs shadow-lg shadow-cyan-600/20 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>Generate Recommendations</span>
            </button>
          </div>

        </form>
      </div>

      {/* Loading State */}
      {loading && (
        <LoadingState 
          message="Finding useful recommendations..." 
          subMessage={`Analyzing study trajectory for ${learningTopic} (${currentLevel})`}
          iconType="recommend"
        />
      )}

      {/* Error */}
      {error && (
        <ErrorMessage message={error} onRetry={handleGenerate} />
      )}

      {/* Recommendations Dashboard Cards */}
      {recData && !loading && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Top 3 Strategic Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Continue Learning */}
            <div className="rounded-3xl bg-slate-900/80 border border-cyan-500/30 p-6 flex flex-col justify-between shadow-xl relative overflow-hidden group hover:border-cyan-500/50 transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-colors" />

              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-xs font-bold mb-4">
                  <Rocket className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Continue Learning</span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2">
                  {recData.continue_learning.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {recData.continue_learning.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 text-[11px] text-cyan-300/90 bg-cyan-950/20 p-3 rounded-xl border border-cyan-800/30">
                <span className="font-semibold">Why: </span>
                {recData.continue_learning.why_recommended}
              </div>
            </div>

            {/* Strengthen Your Knowledge */}
            <div className="rounded-3xl bg-slate-900/80 border border-amber-500/30 p-6 flex flex-col justify-between shadow-xl relative overflow-hidden group hover:border-amber-500/50 transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-colors" />

              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/70 border border-amber-500/40 text-amber-300 text-xs font-bold mb-4">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                  <span>Strengthen Your Knowledge</span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2">
                  {recData.strengthen_knowledge.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {recData.strengthen_knowledge.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                  Focus Areas:
                </span>
                {recData.strengthen_knowledge.key_focus_areas.map((f, i) => (
                  <div key={i} className="text-[11px] text-slate-300 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Challenge Yourself */}
            <div className="rounded-3xl bg-slate-900/80 border border-purple-500/30 p-6 flex flex-col justify-between shadow-xl relative overflow-hidden group hover:border-purple-500/50 transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-colors" />

              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/70 border border-purple-500/40 text-purple-300 text-xs font-bold mb-4">
                  <Flame className="w-3.5 h-3.5 text-purple-400" />
                  <span>Challenge Yourself</span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2">
                  {recData.challenge_yourself.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {recData.challenge_yourself.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block mb-1">
                  Advanced Concepts:
                </span>
                {recData.challenge_yourself.advanced_concepts.map((c, i) => (
                  <div key={i} className="text-[11px] text-slate-300 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Bottom Grid: Practice Exercises & Capstone Project Idea */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Practice Exercises */}
            <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                  <Hammer className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Suggested Practice Exercises</h3>
                  <span className="text-[11px] text-slate-400">Actionable drills to build muscle memory</span>
                </div>
              </div>

              <div className="space-y-2.5 pt-2">
                {recData.practice_exercises.map((ex, idx) => (
                  <div 
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-3"
                  >
                    <span className="w-6 h-6 rounded-lg bg-indigo-600/20 text-indigo-300 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="text-xs text-slate-200 leading-relaxed">
                      {ex}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Project Idea */}
            <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <Code className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Portfolio Project Idea</h3>
                  <span className="text-[11px] text-slate-400">Real-world capstone application</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                <h4 className="text-sm font-bold text-white">
                  {recData.project_idea.title}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {recData.project_idea.description}
                </p>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Deliverables:
                  </span>
                  <div className="space-y-1">
                    {recData.project_idea.deliverables.map((del, i) => (
                      <div key={i} className="text-xs text-slate-300 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span>{del}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Recommended Tech Stack:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {recData.project_idea.tech_stack.map((tech, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-[11px] text-slate-300 font-mono">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* AI Disclaimer Alert */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-400 text-xs flex items-start gap-3">
            <ShieldAlert className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
            <p className="leading-relaxed">
              <strong>Advisory Note:</strong> {recData.disclaimer} These personalized suggestions are synthesized by Google Gemini based on your input profile and do not constitute formal academic certification.
            </p>
          </div>

        </div>
      )}

    </div>
  );
};
