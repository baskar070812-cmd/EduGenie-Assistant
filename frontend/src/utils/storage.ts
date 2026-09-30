import { ChatMessage, QuizResultRecord, LearningPathData } from '../types';
import { DEMO_LEARNING_PATH } from './demoData';

const KEYS = {
  CHAT_MESSAGES: 'edugenie_chat_messages',
  SAVED_QUESTIONS: 'edugenie_saved_questions',
  QUIZ_HISTORY: 'edugenie_quiz_history',
  ACTIVE_PATH: 'edugenie_active_learning_path',
  USER_STATS: 'edugenie_user_stats',
};

export interface UserStats {
  questionsAsked: number;
  quizzesCompleted: number;
  totalScore: number;
  totalPossibleScore: number;
  learningProgressPercent: number;
}

export function loadUserStats(): UserStats {
  try {
    const raw = localStorage.getItem(KEYS.USER_STATS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to load user stats", e);
  }
  // Initial realistic demo stats
  return {
    questionsAsked: 14,
    quizzesCompleted: 3,
    totalScore: 24,
    totalPossibleScore: 30, // 80% average
    learningProgressPercent: 37,
  };
}

export function saveUserStats(stats: UserStats): void {
  try {
    localStorage.setItem(KEYS.USER_STATS, JSON.stringify(stats));
  } catch (e) {
    console.error("Failed to save user stats", e);
  }
}

export function loadChatMessages(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(KEYS.CHAT_MESSAGES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to load chat messages", e);
  }
  return [
    {
      id: 'demo-1',
      role: 'assistant',
      content: "Hello! I'm **EduGenie**, your personal AI academic tutor. What concept, formula, or topic can I help you understand today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedFollowups: [
        "Explain binary search in simple terms.",
        "What is photosynthesis?",
        "What is the difference between TCP and UDP?",
        "Explain the Pythagoras theorem with an example."
      ]
    }
  ];
}

export function saveChatMessages(messages: ChatMessage[]): void {
  try {
    localStorage.setItem(KEYS.CHAT_MESSAGES, JSON.stringify(messages));
  } catch (e) {
    console.error("Failed to save chat messages", e);
  }
}

export function loadSavedQuestions(): string[] {
  try {
    const raw = localStorage.getItem(KEYS.SAVED_QUESTIONS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to load saved questions", e);
  }
  return [
    "What is a binary tree?",
    "Explain the TCP 3-way handshake",
    "How does gradient descent work?"
  ];
}

export function saveQuestionToBookmarks(question: string): string[] {
  const current = loadSavedQuestions();
  if (!current.includes(question)) {
    const updated = [question, ...current].slice(0, 20);
    try {
      localStorage.setItem(KEYS.SAVED_QUESTIONS, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    return updated;
  }
  return current;
}

export function loadQuizHistory(): QuizResultRecord[] {
  try {
    const raw = localStorage.getItem(KEYS.QUIZ_HISTORY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to load quiz history", e);
  }
  return [
    {
      id: 'q-1',
      title: "Data Structures – Foundations",
      topic: "Data Structures",
      score: 8,
      totalQuestions: 10,
      percentage: 80,
      date: "Yesterday"
    },
    {
      id: 'q-2',
      title: "Python Memory & Object Model",
      topic: "Python",
      score: 9,
      totalQuestions: 10,
      percentage: 90,
      date: "3 days ago"
    },
    {
      id: 'q-3',
      title: "SQL Relational Algebra",
      topic: "SQL",
      score: 7,
      totalQuestions: 10,
      percentage: 70,
      date: "5 days ago"
    }
  ];
}

export function recordQuizCompletion(result: Omit<QuizResultRecord, 'id' | 'date'>): QuizResultRecord[] {
  const history = loadQuizHistory();
  const newRecord: QuizResultRecord = {
    ...result,
    id: `quiz-${Date.now()}`,
    date: "Just now"
  };
  const updated = [newRecord, ...history].slice(0, 15);
  try {
    localStorage.setItem(KEYS.QUIZ_HISTORY, JSON.stringify(updated));
    
    // Update stats
    const stats = loadUserStats();
    stats.quizzesCompleted += 1;
    stats.totalScore += result.score;
    stats.totalPossibleScore += result.totalQuestions;
    saveUserStats(stats);
  } catch (e) {
    console.error(e);
  }
  return updated;
}

export function loadActiveLearningPath(): LearningPathData {
  try {
    const raw = localStorage.getItem(KEYS.ACTIVE_PATH);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to load learning path", e);
  }
  return DEMO_LEARNING_PATH;
}

export function saveActiveLearningPath(path: LearningPathData): void {
  try {
    localStorage.setItem(KEYS.ACTIVE_PATH, JSON.stringify(path));
    
    // Calculate progress
    const completedStages = path.stages.filter(s => s.completed).length;
    const progress = Math.round((completedStages / Math.max(path.stages.length, 1)) * 100);
    const stats = loadUserStats();
    stats.learningProgressPercent = progress;
    saveUserStats(stats);
  } catch (e) {
    console.error(e);
  }
}
