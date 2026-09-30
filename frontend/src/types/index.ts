export type AppTab = 
  | 'home' 
  | 'dashboard' 
  | 'tutor' 
  | 'quiz' 
  | 'summarizer' 
  | 'learning-path' 
  | 'recommendations' 
  | 'about';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestedFollowups?: string[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}

export interface QuizData {
  title: string;
  topic: string;
  difficulty: string;
  questions: QuizQuestion[];
  model_used: string;
}

export interface QuizResultRecord {
  id: string;
  title: string;
  topic: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  date: string;
}

export interface SummaryData {
  summary: string;
  key_takeaways: string[];
  original_word_count: number;
  summary_word_count: number;
  compression_ratio: number;
  reading_time_minutes: number;
  model_used: string;
}

export interface LearningStage {
  stage_number: number;
  title: string;
  description: string;
  topics: string[];
  learning_objectives: string[];
  recommended_practice: string[];
  estimated_time: string;
  completed?: boolean;
}

export interface LearningPathData {
  topic: string;
  current_level: string;
  study_time: string;
  duration: string;
  total_stages: number;
  estimated_total_hours: number;
  prerequisites: string[];
  stages: LearningStage[];
  model_used: string;
}

export interface RecommendationData {
  topic: string;
  current_level: string;
  continue_learning: {
    title: string;
    description: string;
    why_recommended: string;
  };
  strengthen_knowledge: {
    title: string;
    description: string;
    key_focus_areas: string[];
  };
  challenge_yourself: {
    title: string;
    description: string;
    advanced_concepts: string[];
  };
  practice_exercises: string[];
  project_idea: {
    title: string;
    description: string;
    deliverables: string[];
    tech_stack: string[];
  };
  disclaimer: string;
  model_used: string;
}

export interface SystemStatus {
  service: string;
  version: string;
  gemini_model: string;
  gemini_configured: boolean;
  mode: 'live_gemini' | 'curated_demo';
}
