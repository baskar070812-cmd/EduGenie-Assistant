import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Brain, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  PlusCircle, 
  HelpCircle, 
  Award, 
  ArrowRight,
  BookOpen,
  ChevronRight
} from 'lucide-react';
import { QuizData, QuizQuestion } from '../types';
import { generateQuizApi } from '../api/quiz';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { recordQuizCompletion } from '../utils/storage';
import { DEMO_QUIZ } from '../utils/demoData';

export const QuizPage: React.FC = () => {
  // Form parameters
  const [topic, setTopic] = useState('Pythagoras Theorem');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [questionType, setQuestionType] = useState<string>('Multiple Choice');
  const [optionalText, setOptionalText] = useState('');

  // Execution state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  
  // Interactive answering state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleGenerateQuiz = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setError(null);
    setSelectedAnswers({});
    setIsSubmitted(false);

    try {
      const data = await generateQuizApi({
        topic: topic.trim(),
        difficulty,
        question_count: questionCount,
        question_type: questionType,
        optional_text: optionalText.trim() || undefined,
      });
      setQuizData(data);
    } catch (err: any) {
      setError(err.message || "Failed to generate quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAnswer = (questionId: number, option: string) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: option
    }));
  };

  const calculateScore = () => {
    if (!quizData) return { score: 0, total: 0, percentage: 0 };
    let score = 0;
    quizData.questions.forEach(q => {
      const selected = selectedAnswers[q.id];
      if (selected && (selected === q.correct_answer || selected.startsWith(q.correct_answer))) {
        score += 1;
      }
    });
    const total = quizData.questions.length;
    const percentage = Math.round((score / Math.max(total, 1)) * 100);
    return { score, total, percentage };
  };

  const handleSubmitQuiz = () => {
    if (!quizData) return;
    const answeredCount = Object.keys(selectedAnswers).length;
    if (answeredCount < quizData.questions.length) {
      if (!window.confirm(`You answered ${answeredCount} of ${quizData.questions.length} questions. Submit anyway?`)) {
        return;
      }
    }

    setIsSubmitted(true);
    const { score, total, percentage } = calculateScore();
    
    // Record to storage
    recordQuizCompletion({
      title: quizData.title,
      topic: quizData.topic,
      score,
      totalQuestions: total,
      percentage
    });

    if (percentage >= 80) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTryAgain = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const { score, total, percentage } = calculateScore();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
      
      {/* Page Title & Subtitle */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-3">
          <Brain className="w-3.5 h-3.5 text-purple-400" />
          <span>Active Recall Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Smart Quiz Generator
        </h1>
        <p className="text-slate-400 text-sm mt-2">
          Test your conceptual understanding through customized AI-generated questions and immediate rationales.
        </p>
      </div>

      {/* Quiz Generator Input Form (Shown when no active quiz or when generating) */}
      {!quizData && (
        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 shadow-xl">
          <form onSubmit={handleGenerateQuiz} className="space-y-6">
            
            {/* Topic Input */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Quiz Topic <span className="text-indigo-400">*</span>
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Pythagoras Theorem, Data Structures, Photosynthesis, Organic Chemistry..."
                required
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 shadow-inner"
              />
              {/* Quick Topic Chips */}
              <div className="flex flex-wrap gap-2 mt-2.5">
                {["Pythagoras Theorem", "Binary Search Trees", "TCP vs UDP", "Cellular Respiration", "SQL Joins"].map((t, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setTopic(t)}
                    className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-750 border border-slate-700/50 transition-colors"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Controls: Difficulty, Count, Type */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              
              {/* Difficulty */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Difficulty Level
                </label>
                <select
                  value={difficulty}
                  onChange={(e: any) => setDifficulty(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              {/* Number of Questions */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Number of Questions
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[5, 10, 15, 20].map((num) => (
                    <button
                      type="button"
                      key={num}
                      onClick={() => setQuestionCount(num)}
                      className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                        questionCount === num
                          ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                          : 'bg-slate-950/60 border-slate-700/70 text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question Type */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Question Format
                </label>
                <select
                  value={questionType}
                  onChange={(e) => setQuestionType(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Multiple Choice">Multiple Choice</option>
                  <option value="True/False">True / False</option>
                  <option value="Mixed">Mixed Formats</option>
                </select>
              </div>

            </div>

            {/* Optional Study Material Area */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Custom Study Notes (Optional)</span>
                <span className="text-[11px] text-slate-500 lowercase font-normal">paste your lecture text to quiz specifically from it</span>
              </label>
              <textarea
                rows={3}
                value={optionalText}
                onChange={(e) => setOptionalText(e.target.value)}
                placeholder="Paste study material, textbook excerpts, or lecture notes here..."
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none shadow-inner"
              />
            </div>

            {/* Generate Button */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => { setQuizData(DEMO_QUIZ); setTopic(DEMO_QUIZ.topic); }}
                className="text-xs text-indigo-400 hover:text-indigo-300 underline"
              >
                Load Sample Data Structures Quiz
              </button>

              <button
                type="submit"
                disabled={loading || !topic.trim()}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-purple-600/25 transition-all flex items-center gap-2 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-40"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Generate Quiz</span>
              </button>
            </div>

          </form>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <LoadingState 
          message="Creating your quiz..." 
          subMessage={`Synthesizing ${questionCount} ${difficulty} level questions on ${topic}`}
          iconType="quiz"
        />
      )}

      {/* Error Message */}
      {error && (
        <ErrorMessage message={error} onRetry={handleGenerateQuiz} />
      )}

      {/* Active Quiz View */}
      {quizData && (
        <div className="space-y-6">
          
          {/* Header Bar with Action Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <div>
              <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">
                {quizData.difficulty} • {quizData.questions.length} Questions
              </span>
              <h2 className="text-xl font-bold text-white mt-0.5">
                {quizData.title}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => { setQuizData(null); setIsSubmitted(false); }}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>New Quiz</span>
              </button>
            </div>
          </div>

          {/* Results Summary Card (After Submission) */}
          {isSubmitted && (
            <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 p-6 sm:p-8 text-center animate-fade-in shadow-2xl relative overflow-hidden">
              <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mx-auto mb-4 border border-indigo-500/30 shadow-lg">
                <Award className="w-8 h-8 text-amber-400" />
              </div>

              <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-1">
                Assessment Results
              </h3>
              
              <div className="text-4xl sm:text-5xl font-black text-white tracking-tight my-2">
                {score} <span className="text-2xl font-normal text-slate-400">/ {total}</span>
              </div>

              <div className={`text-2xl font-extrabold ${percentage >= 80 ? 'text-emerald-400' : percentage >= 60 ? 'text-amber-400' : 'text-rose-400'}`}>
                {percentage}%
              </div>

              {/* Constructive feedback */}
              <p className="text-sm text-slate-300 max-w-lg mx-auto mt-3 leading-relaxed">
                {percentage >= 80 
                  ? "Outstanding mastery! You have a crystal-clear grasp of these core concepts. Ready to move on to advanced topics!" 
                  : percentage >= 60 
                  ? "Solid performance! You have good foundational grasp. Review the detailed explanations below to cement any tricky edge cases." 
                  : "Good effort! Check the rationales below to understand where the reasoning differed, and feel free to try again!"}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                <button
                  onClick={handleTryAgain}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Try Again</span>
                </button>
                <button
                  onClick={() => { setQuizData(null); setIsSubmitted(false); }}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-colors flex items-center gap-1.5"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Generate Another Quiz</span>
                </button>
              </div>
            </div>
          )}

          {/* Question Cards */}
          <div className="space-y-5">
            {quizData.questions.map((q) => {
              const selected = selectedAnswers[q.id];
              const isCorrect = selected && (selected === q.correct_answer || selected.startsWith(q.correct_answer));

              return (
                <div 
                  key={q.id}
                  className={`rounded-2xl p-5 sm:p-6 border transition-all ${
                    isSubmitted
                      ? isCorrect
                        ? 'bg-slate-900/80 border-emerald-500/40 shadow-emerald-500/5'
                        : 'bg-slate-900/80 border-rose-500/40 shadow-rose-500/5'
                      : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Question header */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 font-bold text-xs flex items-center justify-center border border-indigo-500/20">
                        {q.id}
                      </span>
                      <h4 className="text-sm sm:text-base font-semibold text-white leading-relaxed">
                        {q.question}
                      </h4>
                    </div>

                    {isSubmitted && (
                      <div>
                        {isCorrect ? (
                          <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-950/40 border border-emerald-500/30">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-rose-400 text-xs font-bold px-2 py-0.5 rounded-md bg-rose-950/40 border border-rose-500/30">
                            <XCircle className="w-3.5 h-3.5" /> Incorrect
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Options List */}
                  <div className="space-y-2.5">
                    {q.options.map((opt, optIdx) => {
                      const isOptionSelected = selected === opt;
                      const isOptionCorrect = opt === q.correct_answer || opt.startsWith(q.correct_answer);

                      let optionStyle = 'bg-slate-950/50 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700';

                      if (isSubmitted) {
                        if (isOptionCorrect) {
                          optionStyle = 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200 font-medium';
                        } else if (isOptionSelected && !isOptionCorrect) {
                          optionStyle = 'bg-rose-950/40 border-rose-500/60 text-rose-200 line-through';
                        } else {
                          optionStyle = 'bg-slate-950/30 border-slate-850 text-slate-500 opacity-60';
                        }
                      } else if (isOptionSelected) {
                        optionStyle = 'bg-indigo-600/20 border-indigo-500 text-indigo-200 font-medium shadow-sm';
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleSelectAnswer(q.id, opt)}
                          disabled={isSubmitted}
                          className={`w-full text-left px-4 py-3 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between ${optionStyle}`}
                        >
                          <span className="leading-snug">{opt}</span>
                          {isSubmitted && isOptionCorrect && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 ml-2" />
                          )}
                          {isSubmitted && isOptionSelected && !isOptionCorrect && (
                            <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0 ml-2" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation card (Visible after submission) */}
                  {isSubmitted && (
                    <div className="mt-4 pt-3.5 border-t border-slate-800/80 rounded-xl bg-slate-950/50 p-3.5 text-xs text-slate-300 flex items-start gap-2.5">
                      <HelpCircle className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-slate-200">Explanation: </span>
                        <span className="text-slate-300 leading-relaxed">{q.explanation}</span>
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>

          {/* Submit Action Button */}
          {!isSubmitted && (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                {Object.keys(selectedAnswers).length} of {quizData.questions.length} answered
              </span>

              <button
                onClick={handleSubmitQuiz}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-1.5"
              >
                <span>Submit Quiz</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
