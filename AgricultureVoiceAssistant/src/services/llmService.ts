import { ENV } from '../config/env';

export const llmService = {
  async getCropAdvice(query: string, language: string = 'hi') {
    try {
      const response = await fetch(`${ENV.BACKEND_URL}/api/llm/advice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          language,
        }),
      });
      
      return await response.json();
    } catch (error) {
      console.error('LLM service error:', error);
      throw error;
    }
  },

  async getMarketPrediction(crop: string, location: string) {
    try {
      const response = await fetch(`${ENV.BACKEND_URL}/api/llm/market`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          crop,
          location,
        }),
      });
      
      return await response.json();
    } catch (error) {
      console.error('Market prediction error:', error);
      throw error;
    }
  }
}; 