import { apiRequest } from './client';
import { LearningPathData } from '../types';

export interface LearningPathApiRequest {
  topic: string;
  current_level: string;
  study_time: string;
  duration: string;
}

export async function generateLearningPathApi(params: LearningPathApiRequest): Promise<LearningPathData> {
  return await apiRequest<LearningPathData>('/learning-path', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
