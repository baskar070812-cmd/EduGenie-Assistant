const API_BASE = import.meta.env.VITE_API_URL || '/api';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number = 500) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 45000); // 45s for complex Gemini generation

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorMessage = `HTTP error ${response.status}`;
      try {
        const errData = await response.json();
        if (errData && errData.detail) {
          errorMessage = typeof errData.detail === 'string' 
            ? errData.detail 
            : JSON.stringify(errData.detail);
        }
      } catch {
        // use default HTTP error
      }
      throw new ApiError(errorMessage, response.status);
    }

    return await response.json() as T;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new ApiError("The request timed out. Please try again with a shorter prompt.", 408);
    }
    if (error instanceof ApiError) {
      throw error;
    }
    // Network or server unreachable
    throw new ApiError(
      "Unable to reach the EduGenie backend server. Please verify the FastAPI server is running.",
      0
    );
  }
}
