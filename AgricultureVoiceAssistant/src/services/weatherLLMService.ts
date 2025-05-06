import { generateWeatherPrompt } from './prompts/weatherPrompt';

interface WeatherPrediction {
  temperature: {
    max: number;
    min: number;
    current: number;
  };
  conditions: {
    main: string;
    description: string;
  };
  humidity: number;
  wind: {
    speed: number;
    direction: string;
  };
  precipitation: {
    chance: number;
    type: string;
  };
}

export class WeatherLLMService {
  private static instance: WeatherLLMService;
  private model: any; // Replace with your Llama model type

  private constructor() {
    // Initialize Llama model
    this.initModel();
  }

  static getInstance(): WeatherLLMService {
    if (!WeatherLLMService.instance) {
      WeatherLLMService.instance = new WeatherLLMService();
    }
    return WeatherLLMService.instance;
  }

  private async initModel() {
    try {
      // Temporarily return mock data
      this.model = {
        generate: async (prompt: string) => {
          return JSON.stringify({
            temperature: {
              max: 32,
              min: 24,
              current: 28
            },
            conditions: {
              main: "आंशिक बादल",
              description: "हल्के बादल छाए हुए हैं",
              traditional_signs: [
                "दक्षिण से हवा चल रही है",
                "बगुले नीचे उड़ रहे हैं"
              ],
              farming_advice: [
                "फसलों की सिंचाई करें",
                "खरपतवार निकालें"
              ]
            },
            humidity: 65,
            wind: {
              speed: 12,
              direction: "दक्षिण-पश्चिम",
              impact_on_crops: "अनुकूल"
            },
            precipitation: {
              chance: 30,
              type: "हल्की बूंदाबांदी",
              farming_implications: "सिंचाई की आवश्यकता नहीं"
            }
          });
        }
      };
    } catch (error) {
      console.error('Error initializing LLM model:', error);
      throw error;
    }
  }

  async getWeatherPrediction(location: string, date: string): Promise<WeatherPrediction> {
    try {
      const prompt = generateWeatherPrompt(location, date);
      
      // Get prediction from Llama
      const response = await this.model.generate(prompt, {
        maxTokens: 500,
        temperature: 0.7,
        topP: 0.9,
      });

      // Parse the response
      const prediction = JSON.parse(response);

      // Add some randomness and realism to the prediction
      this.adjustPredictionWithRules(prediction, date);

      return prediction;
    } catch (error) {
      console.error('Weather prediction error:', error);
      throw error;
    }
  }

  private adjustPredictionWithRules(prediction: WeatherPrediction, date: string) {
    const month = new Date(date).getMonth();
    
    // Apply seasonal adjustments
    if (month >= 3 && month <= 5) { // Summer
      prediction.temperature.max = Math.min(45, prediction.temperature.max);
      prediction.temperature.min = Math.max(25, prediction.temperature.min);
      prediction.humidity = Math.min(60, prediction.humidity);
    } else if (month >= 6 && month <= 8) { // Monsoon
      prediction.precipitation.chance = Math.max(60, prediction.precipitation.chance);
      prediction.humidity = Math.max(70, prediction.humidity);
    }

    // Ensure realistic relationships
    prediction.temperature.current = 
      (prediction.temperature.max + prediction.temperature.min) / 2;
    
    if (prediction.precipitation.chance > 70) {
      prediction.conditions.main = "बारिश";
      prediction.wind.speed = Math.max(15, prediction.wind.speed);
    }
  }

  async getForecast(location: string, days: number = 7): Promise<WeatherPrediction[]> {
    const forecast: WeatherPrediction[] = [];
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const prediction = await this.getWeatherPrediction(
        location,
        date.toISOString()
      );
      forecast.push(prediction);
    }

    return forecast;
  }
} 