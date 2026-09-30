import { apiRequest } from './client';
import { ChatMessage } from '../types';

export interface ChatApiRequest {
  message: string;
  conversation_history: { role: string; content: string }[];
  topic?: string;
  level?: string;
}

export interface ChatApiResponse {
  response: string;
  suggested_followups: string[];
  model_used: string;
}

export async function sendChatMessage(
  message: string,
  history: ChatMessage[],
  level: string = 'Beginner',
  topic?: string
): Promise<ChatApiResponse> {
  // Format history for backend
  const formattedHistory = history.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    content: msg.content,
  }));

  return await apiRequest<ChatApiResponse>('/chat', {
    method: 'POST',
    body: JSON.stringify({
      message,
      conversation_history: formattedHistory,
      level,
      topic: topic || undefined,
    }),
  });
}
