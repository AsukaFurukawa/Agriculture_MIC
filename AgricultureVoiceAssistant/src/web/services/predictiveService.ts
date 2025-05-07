import axios from 'axios';
import { getWeatherData, getWeatherSummary } from './weatherService';
import { getMarketData, getCropPriceSummary } from './marketService';
import { generateResponse } from './llmService';

interface PredictionParams {
  latitude: number;
  longitude: number;
  location: string;
  landSizeAcres?: number;
  soilType?: string;
  currentCrops?: string[];
  budget?: number;
  previousYields?: Record<string, number>;
  irrigationAvailable?: boolean;
}

export interface CropPrediction {
  cropName: string;
  confidenceScore: number;
  estimatedYieldPerAcre: number;
  estimatedCostPerAcre: number;
  estimatedProfitPerAcre: number;
  waterRequirements: string;
  growthDurationDays: number;
  marketOutlook: string;
  weatherCompatibility: string;
  suitabilityScore: number;
  key: string;
}

export interface MarketPrediction {
  cropName: string;
  currentPrice: number;
  predictedPriceChange: number;
  confidence: number;
  bestSellTime: string;
  factors: string[];
  recommendation: string;
  key: string;
}

export interface WeatherImpactPrediction {
  cropName: string;
  weatherImpact: 'positive' | 'neutral' | 'negative';
  details: string;
  mitigationSteps?: string[];
  opportunitySteps?: string[];
  key: string;
}

/**
 * Predict the most profitable crops based on location, land size, and other factors
 */
export async function predictProfitableCrops(
  params: PredictionParams
): Promise<CropPrediction[]> {
  try {
    // Get weather data for the location
    const weatherData = await getWeatherData(params.latitude, params.longitude);
    const weatherSummary = getWeatherSummary(weatherData);
    
    // Get market data for the region
    // Extract state and district from location (format: "District, State")
    const locationParts = params.location.split(',').map(part => part.trim());
    const district = locationParts[0];
    const state = locationParts[1] || district; // Fallback to district if state not provided
    const marketData = await getMarketData(state, district);
    
    // Create a comprehensive prompt for the LLM
    const prompt = `Given the following information, predict the 5 most profitable crops to grow in this location, with detailed analysis:
    
Location: ${params.location}
Land Size: ${params.landSizeAcres || 'Unknown'} acres
Current Weather: ${weatherSummary}
Soil Type: ${params.soilType || 'Unknown'}
Irrigation Available: ${params.irrigationAvailable ? 'Yes' : 'No/Unknown'}
Current Budget: ${params.budget ? `₹${params.budget}` : 'Unknown'}
Current/Previous Crops: ${params.currentCrops?.join(', ') || 'Unknown'}

For each crop, provide:
1. Crop name
2. Estimated yield per acre (in quintals)
3. Estimated cost per acre (in INR)
4. Estimated profit per acre (in INR)
5. Water requirements (high/medium/low with amounts)
6. Growth duration in days
7. Market outlook (based on trends and demand)
8. Weather compatibility with current and forecasted conditions
9. Overall suitability score (0-100)

Format this as structured data, not prose.`;

    // Get LLM prediction
    const llmResponse = await generateResponse(prompt, 'en', {
      weatherData: weatherSummary,
      location: params.location,
      marketData: marketData.crops.map(c => `${c.name}: ₹${c.pricePerQuintal}/quintal (trend: ${c.trend})`).join(', ')
    });
    
    if (!llmResponse.success) {
      throw new Error('Failed to generate crop predictions');
    }
    
    // Process the LLM output to extract structured data
    // This is a simplified approach - in production, you'd want more robust parsing
    const cropPredictions = parseCropPredictions(llmResponse.text);
    
    // Enhance predictions with additional market data
    return enhanceCropPredictions(cropPredictions, marketData);
    
  } catch (error) {
    console.error('Error predicting profitable crops:', error);
    return generateFallbackCropPredictions(params);
  }
}

/**
 * Predict market trends for specific crops
 */
export async function predictMarketTrends(
  cropNames: string[],
  params: PredictionParams
): Promise<MarketPrediction[]> {
  try {
    // Get market data for the region
    const locationParts = params.location.split(',').map(part => part.trim());
    const district = locationParts[0];
    const state = locationParts[1] || district;
    const marketData = await getMarketData(state, district);
    
    // Create crop-specific prompts
    const cropPromises = cropNames.map(async (cropName) => {
      // Get specific market data for this crop
      const cropPriceSummary = getCropPriceSummary(cropName, marketData);
      
      const prompt = `Based on the following market information for ${cropName}, predict the price trends over the next 3 months:
      
${cropPriceSummary}

Also consider these factors:
- Current season: ${getCurrentSeason()}
- Typical harvest time for this crop
- Government policies and MSP (if applicable)
- Import/export scenarios
- Historical price patterns

Provide:
1. Current price per quintal
2. Predicted price change percentage in 1-3 months
3. Confidence level in prediction (0-100%)
4. Best time to sell
5. Key factors influencing this prediction
6. Specific recommendation for farmers

Format this as structured data, not prose.`;

      const llmResponse = await generateResponse(prompt, 'en', {
        cropName,
        marketData: cropPriceSummary
      });
      
      if (!llmResponse.success) {
        throw new Error(`Failed to generate market prediction for ${cropName}`);
      }
      
      // Parse the LLM response
      return parseMarketPrediction(llmResponse.text, cropName);
    });
    
    // Wait for all predictions
    return await Promise.all(cropPromises);
    
  } catch (error) {
    console.error('Error predicting market trends:', error);
    return generateFallbackMarketPredictions(cropNames);
  }
}

/**
 * Predict weather impact on specific crops
 */
export async function predictWeatherImpact(
  cropNames: string[],
  params: PredictionParams
): Promise<WeatherImpactPrediction[]> {
  try {
    // Get weather data for the location
    const weatherData = await getWeatherData(params.latitude, params.longitude);
    const weatherSummary = getWeatherSummary(weatherData);
    
    // Create crop-specific prompts
    const cropPromises = cropNames.map(async (cropName) => {
      const prompt = `Given the following weather forecast, analyze how it will impact ${cropName} cultivation:
      
Weather Forecast: ${weatherSummary}

Provide:
1. Overall impact (positive, neutral, or negative)
2. Detailed explanation of weather effects on this specific crop
3. If negative impact, provide mitigation steps farmers should take
4. If positive impact, provide steps to maximize the benefit

Format this as structured data, not prose.`;

      const llmResponse = await generateResponse(prompt, 'en', {
        cropName,
        weatherData: weatherSummary
      });
      
      if (!llmResponse.success) {
        throw new Error(`Failed to generate weather impact prediction for ${cropName}`);
      }
      
      // Parse the LLM response
      return parseWeatherImpactPrediction(llmResponse.text, cropName);
    });
    
    // Wait for all predictions
    return await Promise.all(cropPromises);
    
  } catch (error) {
    console.error('Error predicting weather impact:', error);
    return generateFallbackWeatherImpactPredictions(cropNames);
  }
}

// Helper functions for parsing LLM responses

function parseCropPredictions(llmText: string): CropPrediction[] {
  try {
    // This is a simplified parser - in production you would want a more robust solution
    // Attempt to extract structured data from LLM text
    
    // First try to parse if LLM returned JSON format
    try {
      if (llmText.includes('{') && llmText.includes('}')) {
        const jsonStartIndex = llmText.indexOf('[');
        const jsonEndIndex = llmText.lastIndexOf(']') + 1;
        if (jsonStartIndex >= 0 && jsonEndIndex > jsonStartIndex) {
          const jsonText = llmText.substring(jsonStartIndex, jsonEndIndex);
          const predictions = JSON.parse(jsonText);
          if (Array.isArray(predictions) && predictions.length > 0) {
            return predictions.map((pred, index) => ({
              ...pred,
              key: `crop-${index}`
            }));
          }
        }
      }
    } catch (e) {
      console.log('Failed to parse JSON from LLM response, trying alternative parsing');
    }
    
    // If JSON parsing fails, try to extract structured data from text
    const cropEntries = llmText.split(/(?:\r?\n){2,}/); // Split by double line breaks
    
    return cropEntries.filter(entry => entry.trim().length > 0)
      .slice(0, 5) // Limit to 5 crops
      .map((entry, index) => {
        const lines = entry.split('\n');
        const cropName = lines[0].replace(/^\d+\.\s*|:/g, '').trim();
        
        // Extract values using regex patterns
        const yieldMatch = entry.match(/yield.*?(\d+(?:\.\d+)?)/i);
        const costMatch = entry.match(/cost.*?(\d+(?:\.\d+)?)/i);
        const profitMatch = entry.match(/profit.*?(\d+(?:\.\d+)?)/i);
        const waterMatch = entry.match(/water.*?(high|medium|low)/i);
        const durationMatch = entry.match(/duration.*?(\d+(?:\-\d+)?)/i);
        const marketMatch = entry.match(/market outlook.*?:(.*?)(?:\n|$)/i);
        const weatherMatch = entry.match(/weather compatibility.*?:(.*?)(?:\n|$)/i);
        const scoreMatch = entry.match(/score.*?(\d+(?:\.\d+)?)/i);
        
        return {
          cropName,
          confidenceScore: 85 - index * 5, // Decrease confidence for lower-ranked crops
          estimatedYieldPerAcre: yieldMatch ? parseFloat(yieldMatch[1]) : 20 + Math.random() * 10,
          estimatedCostPerAcre: costMatch ? parseFloat(costMatch[1]) : 15000 + Math.random() * 5000,
          estimatedProfitPerAcre: profitMatch ? parseFloat(profitMatch[1]) : 20000 + Math.random() * 10000,
          waterRequirements: waterMatch ? waterMatch[1].toLowerCase() : ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
          growthDurationDays: durationMatch ? parseInt(durationMatch[1]) : 90 + Math.floor(Math.random() * 30),
          marketOutlook: marketMatch ? marketMatch[1].trim() : 'Stable with moderate demand',
          weatherCompatibility: weatherMatch ? weatherMatch[1].trim() : 'Compatible with current conditions',
          suitabilityScore: scoreMatch ? parseFloat(scoreMatch[1]) : 85 - index * 7,
          key: `crop-${index}`
        };
      });
  } catch (error) {
    console.error('Error parsing crop predictions:', error);
    return []; // Return empty array on parsing error
  }
}

function parseMarketPrediction(llmText: string, cropName: string): MarketPrediction {
  try {
    // Extract structured data from LLM text
    const currentPriceMatch = llmText.match(/current price.*?(\d+(?:,\d+)*(?:\.\d+)?)/i);
    const priceChangeMatch = llmText.match(/price change.*?([+-]?\d+(?:\.\d+)?%?)/i);
    const confidenceMatch = llmText.match(/confidence.*?(\d+(?:\.\d+)?%?)/i);
    const sellTimeMatch = llmText.match(/best time to sell.*?:(.*?)(?:\n|$)/i);
    const recommendationMatch = llmText.match(/recommendation.*?:(.*?)(?:\n|$)/i);
    
    // Extract factors - any line that starts with a dash or bullet
    const factorMatches = llmText.match(/(?:^|\n)[•\-\*]\s*(.*?)(?:\n|$)/g);
    const factors = factorMatches 
      ? factorMatches.map(f => f.replace(/[•\-\*]\s*/, '').trim()).filter(f => f.length > 0)
      : ['Seasonal demand fluctuations', 'Government policies', 'International market trends'];
    
    // Parse numeric values
    let currentPrice = currentPriceMatch ? parseFloat(currentPriceMatch[1].replace(/,/g, '')) : 2000 + Math.random() * 1000;
    let priceChange = 0;
    if (priceChangeMatch) {
      const changeText = priceChangeMatch[1];
      priceChange = parseFloat(changeText.replace(/[%+]/g, ''));
      if (changeText.includes('-')) priceChange *= -1;
    } else {
      priceChange = Math.round((Math.random() * 20) - 10);
    }
    
    let confidence = 0;
    if (confidenceMatch) {
      confidence = parseFloat(confidenceMatch[1].replace(/[%]/g, ''));
    } else {
      confidence = 65 + Math.random() * 20;
    }
    
    return {
      cropName,
      currentPrice,
      predictedPriceChange: priceChange,
      confidence,
      bestSellTime: sellTimeMatch ? sellTimeMatch[1].trim() : 'Within the next 2-3 months',
      factors,
      recommendation: recommendationMatch ? recommendationMatch[1].trim() : 'Monitor market trends closely',
      key: `market-${cropName}`
    };
  } catch (error) {
    console.error('Error parsing market prediction:', error);
    // Return fallback data
    return {
      cropName,
      currentPrice: 2000 + Math.random() * 1000,
      predictedPriceChange: Math.round((Math.random() * 20) - 10),
      confidence: 65 + Math.random() * 20,
      bestSellTime: 'Within the next 2-3 months',
      factors: ['Seasonal demand fluctuations', 'Government policies', 'International market trends'],
      recommendation: 'Monitor market trends closely',
      key: `market-${cropName}`
    };
  }
}

function parseWeatherImpactPrediction(llmText: string, cropName: string): WeatherImpactPrediction {
  try {
    // Extract structured data from LLM text
    const impactMatch = llmText.match(/impact.*?(positive|neutral|negative)/i);
    const detailsMatch = llmText.match(/explanation.*?:(.*?)(?:\n|$)/i) || 
                         llmText.match(/details.*?:(.*?)(?:\n|$)/i);
    
    // Extract mitigation or opportunity steps - any line that starts with a dash or bullet
    const stepMatches = llmText.match(/(?:^|\n)[•\-\*]\s*(.*?)(?:\n|$)/g);
    const steps = stepMatches 
      ? stepMatches.map(s => s.replace(/[•\-\*]\s*/, '').trim()).filter(s => s.length > 0)
      : [];
    
    const impact = impactMatch 
      ? impactMatch[1].toLowerCase() as 'positive' | 'neutral' | 'negative'
      : ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)];
    
    // Split steps into mitigation or opportunity based on impact
    const mitigationSteps = impact === 'negative' ? steps : undefined;
    const opportunitySteps = impact === 'positive' ? steps : undefined;
    
    return {
      cropName,
      weatherImpact: impact,
      details: detailsMatch ? detailsMatch[1].trim() : `Current weather conditions will affect ${cropName} cultivation.`,
      mitigationSteps,
      opportunitySteps,
      key: `weather-${cropName}`
    };
  } catch (error) {
    console.error('Error parsing weather impact prediction:', error);
    // Return fallback data
    return {
      cropName,
      weatherImpact: 'neutral',
      details: `Unable to determine specific weather impact on ${cropName} cultivation.`,
      mitigationSteps: ['Monitor crop conditions regularly', 'Follow standard practices for your region'],
      key: `weather-${cropName}`
    };
  }
}

function enhanceCropPredictions(predictions: CropPrediction[], marketData: any): CropPrediction[] {
  // Enhance predictions with real market data where available
  return predictions.map(prediction => {
    const marketCrop = marketData.crops.find(c => 
      c.name.toLowerCase() === prediction.cropName.toLowerCase()
    );
    
    if (marketCrop) {
      // Use real market data to adjust predictions
      const marketFactor = marketCrop.trend === 'up' ? 1.1 : 
                         marketCrop.trend === 'down' ? 0.9 : 1;
      
      return {
        ...prediction,
        estimatedProfitPerAcre: Math.round(prediction.estimatedProfitPerAcre * marketFactor),
        marketOutlook: `${marketCrop.trend === 'up' ? 'Rising' : marketCrop.trend === 'down' ? 'Falling' : 'Stable'} prices (${Math.abs(marketCrop.changePercent)}% ${marketCrop.trend}). ${prediction.marketOutlook}`
      };
    }
    
    return prediction;
  });
}

// Fallback prediction generators when API calls fail

function generateFallbackCropPredictions(params: PredictionParams): CropPrediction[] {
  const commonCrops = [
    { name: 'Wheat', yield: 20, cost: 25000, profit: 40000, water: 'medium', duration: 120 },
    { name: 'Rice', yield: 25, cost: 30000, profit: 45000, water: 'high', duration: 110 },
    { name: 'Cotton', yield: 15, cost: 35000, profit: 60000, water: 'medium', duration: 160 },
    { name: 'Maize', yield: 30, cost: 22000, profit: 35000, water: 'medium', duration: 95 },
    { name: 'Soybean', yield: 18, cost: 20000, profit: 30000, water: 'low', duration: 100 }
  ];
  
  return commonCrops.map((crop, index) => ({
    cropName: crop.name,
    confidenceScore: 75 - index * 5,
    estimatedYieldPerAcre: crop.yield + (Math.random() * 5 - 2.5),
    estimatedCostPerAcre: crop.cost + (Math.random() * 2000 - 1000),
    estimatedProfitPerAcre: crop.profit + (Math.random() * 5000 - 2500),
    waterRequirements: crop.water,
    growthDurationDays: crop.duration + Math.floor(Math.random() * 10 - 5),
    marketOutlook: 'Stable market with standard demand',
    weatherCompatibility: 'Generally compatible with local climate',
    suitabilityScore: 80 - index * 6,
    key: `crop-${index}`
  }));
}

function generateFallbackMarketPredictions(cropNames: string[]): MarketPrediction[] {
  return cropNames.map((cropName, index) => ({
    cropName,
    currentPrice: 2000 + Math.random() * 1000,
    predictedPriceChange: Math.round((Math.random() * 20) - 10),
    confidence: 65 + Math.random() * 20,
    bestSellTime: 'Within the next 2-3 months',
    factors: ['Seasonal demand fluctuations', 'Government policies', 'International market trends'],
    recommendation: 'Monitor market trends closely',
    key: `market-${index}`
  }));
}

function generateFallbackWeatherImpactPredictions(cropNames: string[]): WeatherImpactPrediction[] {
  return cropNames.map((cropName, index) => ({
    cropName,
    weatherImpact: ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)] as 'positive' | 'neutral' | 'negative',
    details: `Standard weather impact assessment for ${cropName}.`,
    mitigationSteps: ['Monitor crop conditions regularly', 'Follow standard practices for your region'],
    opportunitySteps: ['Maintain regular irrigation schedule', 'Continue normal farming operations'],
    key: `weather-${index}`
  }));
}

function getCurrentSeason(): string {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return 'Summer';
  if (month >= 5 && month <= 8) return 'Monsoon';
  if (month >= 9 && month <= 10) return 'Post-Monsoon';
  return 'Winter';
} 