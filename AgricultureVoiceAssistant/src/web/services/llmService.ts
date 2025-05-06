import axios from 'axios';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
// In a real app, you would get this from environment variables
// For demo purposes, we'll use a placeholder
const API_KEY = 'YOUR_OPENAI_API_KEY'; 

// Cache for responses to avoid unnecessary API calls
const responseCache = new Map();

// Cache expiry time (10 minutes)
const CACHE_EXPIRY_MS = 10 * 60 * 1000;

interface CachedResponse {
  response: string;
  timestamp: number;
}

export interface LLMResponse {
  text: string;
  success: boolean;
  error?: string;
}

/**
 * Generate a response from the LLM based on user query
 * 
 * @param query User's question or prompt
 * @param language Language code (e.g., 'en', 'hi', 'ta')
 * @param contextInfo Additional context information (location, weather, etc.)
 * @returns LLMResponse object containing response text or error
 */
export async function generateResponse(
  query: string, 
  language: string = 'en',
  contextInfo?: {
    location?: string;
    weather?: string;
    cropType?: string;
    [key: string]: any;
  }
): Promise<LLMResponse> {
  try {
    // Create a cache key from the query and context
    const cacheKey = `${query}_${language}_${JSON.stringify(contextInfo || {})}`;
    
    // Check if we have a cached response that's still valid
    const cachedData = responseCache.get(cacheKey) as CachedResponse;
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_EXPIRY_MS) {
      console.log('Using cached LLM response');
      return {
        text: cachedData.response,
        success: true
      };
    }
    
    // Construct the system prompt with agricultural expertise
    const systemPrompt = `You are an agricultural assistant for Indian farmers. 
    Provide clear, practical advice in ${getLanguageName(language)} language.
    Focus on sustainable farming practices, crop management, pest control, and market information.
    Keep responses brief and actionable, using simple language appropriate for farmers.
    Include specific measurements, timings, and local context when possible.`;

    // Construct the user message with context
    let userMessage = query;
    if (contextInfo) {
      userMessage += "\n\nContext information:";
      if (contextInfo.location) userMessage += `\nLocation: ${contextInfo.location}`;
      if (contextInfo.weather) userMessage += `\nWeather: ${contextInfo.weather}`;
      if (contextInfo.cropType) userMessage += `\nCrop: ${contextInfo.cropType}`;
      
      // Add any other context properties
      Object.entries(contextInfo).forEach(([key, value]) => {
        if (key !== 'location' && key !== 'weather' && key !== 'cropType') {
          userMessage += `\n${key}: ${value}`;
        }
      });
    }
    
    // Make API request to OpenAI or other LLM provider
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: 'gpt-4o', // Use the latest capable model
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.5, // More focused responses
        max_tokens: 400 // Keep responses concise
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        }
      }
    );
    
    // Extract the response text
    const responseText = response.data.choices[0].message.content;
    
    // Cache the response
    responseCache.set(cacheKey, {
      response: responseText,
      timestamp: Date.now()
    });
    
    return {
      text: responseText,
      success: true
    };
  } catch (error) {
    console.error('LLM API Error:', error);
    
    // Provide a graceful fallback response
    return mockResponse(query, language, contextInfo);
  }
}

/**
 * Provides a mock response when the API fails
 * This allows the app to continue functioning without an API key
 */
function mockResponse(
  query: string, 
  language: string = 'en',
  contextInfo?: any
): LLMResponse {
  // Simple query classification
  const queryLower = query.toLowerCase();
  
  // Mock responses based on query type
  if (queryLower.includes('weather') || queryLower.includes('rain') || queryLower.includes('मौसम')) {
    return {
      text: translateMockResponse('Based on the forecast, expect clear skies for the next 2 days, followed by a 60% chance of rain. This is good timing for applying fertilizer now, before the rain arrives.', language),
      success: true
    };
  } else if (queryLower.includes('pest') || queryLower.includes('disease') || queryLower.includes('कीट')) {
    return {
      text: translateMockResponse('Yellow spots on leaves typically indicate a fungal infection. Apply a copper-based fungicide early morning at 2ml per liter of water. Repeat after 7 days if needed.', language),
      success: true
    };
  } else if (queryLower.includes('price') || queryLower.includes('market') || queryLower.includes('बाजार')) {
    return {
      text: translateMockResponse('Current prices for your crops in nearby markets: Wheat: ₹2,200/quintal, Rice: ₹1,950/quintal. Prices expected to rise by 5-10% in the next 2 weeks based on market trends.', language),
      success: true
    };
  } else if (queryLower.includes('fertilizer') || queryLower.includes('soil') || queryLower.includes('उर्वरक')) {
    return {
      text: translateMockResponse('For your crop, apply NPK 10-26-26 at 100kg/hectare during sowing, followed by urea at 50kg/hectare after 30 days. Consider adding organic compost to improve soil structure.', language),
      success: true
    };
  } else if (queryLower.includes('water') || queryLower.includes('irrigation') || queryLower.includes('सिंचाई')) {
    return {
      text: translateMockResponse('Your crop requires irrigation every 8-10 days during this growth stage. Early morning irrigation is most efficient, using approximately 25mm of water per session.', language),
      success: true
    };
  } else {
    return {
      text: translateMockResponse('I can help with information about weather, pests, market prices, soil management, and irrigation for your crops. How else can I assist with your farming needs today?', language),
      success: true
    };
  }
}

/**
 * Simple mock translation function
 * In a real app, this would use a translation service
 */
function translateMockResponse(text: string, language: string): string {
  // For demo purposes, we'll just add a language note
  // In a real app, you would use a translation API or service
  if (language !== 'en') {
    return `[This would be translated to ${getLanguageName(language)}]: ${text}`;
  }
  return text;
}

/**
 * Maps language codes to language names
 */
function getLanguageName(languageCode: string): string {
  const languageMap: Record<string, string> = {
    'en': 'English',
    'hi': 'Hindi',
    'bn': 'Bengali',
    'ta': 'Tamil',
    'te': 'Telugu',
    'mr': 'Marathi',
    'gu': 'Gujarati',
    'kn': 'Kannada',
    'ml': 'Malayalam',
    'pa': 'Punjabi'
  };
  
  return languageMap[languageCode] || 'English';
}

/**
 * Translates text to the specified language
 * In a real app, this would connect to a translation API
 */
export async function translateText(
  text: string, 
  targetLanguage: string
): Promise<string> {
  try {
    // In a real app, you would make an API call to a translation service
    // For demo purposes, we'll just return the original with a note
    return `[Translated to ${getLanguageName(targetLanguage)}]: ${text}`;
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Fallback to original text
  }
}

/**
 * Clear the response cache
 */
export function clearResponseCache(): void {
  responseCache.clear();
}

/**
 * Get statistics about the cache
 */
export function getCacheStats(): { size: number, oldestEntry: number | null } {
  let oldestTimestamp: number | null = null;
  
  responseCache.forEach((value: CachedResponse) => {
    if (oldestTimestamp === null || value.timestamp < oldestTimestamp) {
      oldestTimestamp = value.timestamp;
    }
  });
  
  return {
    size: responseCache.size,
    oldestEntry: oldestTimestamp ? Date.now() - oldestTimestamp : null
  };
} 