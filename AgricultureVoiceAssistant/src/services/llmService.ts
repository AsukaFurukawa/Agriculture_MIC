import { LlamaModel } from '@llama/react-native';

interface LLMContext {
  location: string;
  language: string;
  season: string;
  landSize: number;
  soilType: string;
  rainfall: number;
}

export const llmService = {
  async getPrediction(prompt: string, context: LLMContext) {
    try {
      // Create a context-aware prompt
      const enhancedPrompt = `
        Context:
        - Location: ${context.location}
        - Local language: ${context.language}
        - Current season: ${context.season}
        - Land size: ${context.landSize} acres
        - Soil type: ${context.soilType}
        - Annual rainfall: ${context.rainfall}mm

        Based on this context, ${prompt}

        Provide response in ${context.language} with:
        1. Detailed farming advice
        2. Local market insights
        3. Traditional farming wisdom
        4. Risk factors
      `;

      // Get LLaMA's prediction
      const response = await LlamaModel.generate(enhancedPrompt);

      return response;
    } catch (error) {
      console.error('LLM Error:', error);
      return null;
    }
  }
};

// Example usage:
const farmingAdvice = await llmService.getPrediction(
  "What crops should I grow?",
  {
    location: "Mysore, Karnataka",
    language: "kn-IN",
    season: "Kharif",
    landSize: 20,
    soilType: "Red soil",
    rainfall: 800
  }
); 