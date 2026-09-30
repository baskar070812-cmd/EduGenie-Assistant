import { apiRequest } from './client';
import { RecommendationData } from '../types';

export interface RecommendationsApiRequest {
  learning_topic: string;
  current_level: string;
  completed_topics?: string;
  goals?: string;
}

export async function generateRecommendationsApi(params: RecommendationsApiRequest): Promise<RecommendationData> {
  return await apiRequest<RecommendationData>('/recommendations', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
