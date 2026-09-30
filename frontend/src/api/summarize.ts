import { apiRequest } from './client';
import { SummaryData } from '../types';

export interface SummaryApiRequest {
  text: string;
  summary_length: string;
  format: string;
}

export async function summarizeTextApi(params: SummaryApiRequest): Promise<SummaryData> {
  return await apiRequest<SummaryData>('/summarize', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
