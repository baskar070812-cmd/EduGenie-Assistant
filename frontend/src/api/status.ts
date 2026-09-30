import { apiRequest } from './client';
import { SystemStatus } from '../types';

export async function fetchSystemStatus(): Promise<SystemStatus> {
  return await apiRequest<SystemStatus>('/status', {
    method: 'GET',
  });
}
