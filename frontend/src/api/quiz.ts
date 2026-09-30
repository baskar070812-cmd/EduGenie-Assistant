import { apiRequest } from './client';
import { QuizData } from '../types';

export interface QuizApiRequest {
  topic: string;
  difficulty: string;
  question_count: number;
  question_type: string;
  optional_text?: string;
}

export async function generateQuizApi(params: QuizApiRequest): Promise<QuizData> {
  return await apiRequest<QuizData>('/quiz', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
