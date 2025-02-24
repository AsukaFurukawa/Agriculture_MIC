import { ENV, CROP_TYPES } from '../config/env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import cheerio from 'react-native-cheerio';

export const marketService = {
  // Get prices from cache first, then update from network
  getCurrentPrices: async (state: string, district: string) => {
    try {
      // Try to get cached data first
      const cachedData = await AsyncStorage.getItem(`market_prices_${state}_${district}`);
      if (cachedData) {
        return JSON.parse(cachedData).prices;
      }

      // Use LLM for price prediction and advice
      const prices = await getPricesFromLLM(state, district);
      
      // Cache the new data
      await AsyncStorage.setItem(`market_prices_${state}_${district}`, JSON.stringify({
        prices,
        timestamp: Date.now()
      }));

      return prices;
    } catch (error) {
      console.error('Market price error:', error);
      return getDefaultPrices(state);
    }
  },

  // More sophisticated crop predictions
  getCropPredictions: async (cropType: string, landSize: number, location: string) => {
    try {
      // Get multiple data points
      const [marketPrices, weatherForecast, soilData] = await Promise.all([
        marketService.getCurrentPrices(location, ''),
        weatherService.getForecast(0, 0), // Add actual coordinates
        getSoilData(location)
      ]);

      return generateCropRecommendations(cropType, landSize, {
        marketPrices,
        weatherForecast,
        soilData
      });
    } catch (error) {
      console.error('Prediction error:', error);
      throw error;
    }
  }
};

// Helper function to fetch market prices
async function fetchMarketPrices(state: string, district: string) {
  // Try multiple sources
  try {
    // Try official API first
    const response = await fetch(`${ENV.AGMARKNET_URL}?state=${state}&district=${district}`);
    return await response.json();
  } catch (error) {
    // Fallback to scraping
    return await scrapeMarketPrices(state, district);
  }
}

async function scrapeMarketPrices(state: string, district: string) {
  try {
    const response = await fetch('https://agmarknet.gov.in/SearchCmmMkt.aspx', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `state=${encodeURIComponent(state)}&district=${encodeURIComponent(district)}`,
    });

    const html = await response.text();
    const $ = cheerio.load(html);
    
    const prices: any[] = [];
    
    // Parse the market price table
    $('#gridRecords tr').each((i, row) => {
      if (i === 0) return; // Skip header row
      
      const columns = $(row).find('td');
      prices.push({
        crop: $(columns[2]).text().trim(),
        variety: $(columns[3]).text().trim(),
        minPrice: parseFloat($(columns[4]).text().trim()),
        maxPrice: parseFloat($(columns[5]).text().trim()),
        modalPrice: parseFloat($(columns[6]).text().trim()),
        market: $(columns[1]).text().trim(),
        date: $(columns[0]).text().trim(),
      });
    });

    return prices;
  } catch (error) {
    console.error('Scraping error:', error);
    throw error;
  }
}

// More sophisticated recommendation engine
function generateCropRecommendations(cropType: string, landSize: number, data: any) {
  const { marketPrices, weatherForecast, soilData } = data;
  
  // Calculate risk factors
  const weatherRisk = calculateWeatherRisk(weatherForecast, cropType);
  const marketRisk = calculateMarketRisk(marketPrices, cropType);
  const soilSuitability = calculateSoilSuitability(soilData, cropType);

  // Generate detailed recommendations
  return {
    crop: cropType,
    suitability: (weatherRisk + marketRisk + soilSuitability) / 3,
    expectedProfit: calculateExpectedProfit(marketPrices, landSize, cropType),
    risks: {
      weather: weatherRisk,
      market: marketRisk,
      soil: soilSuitability
    },
    recommendations: generateDetailedRecommendations(weatherRisk, marketRisk, soilSuitability)
  };
}

async function getPricesFromLLM(state: string, district: string) {
  const prompt = `
    Based on historical trends and current market conditions, provide market prices and advice for major crops in ${district}, ${state}, India.
    Consider:
    - Seasonal variations
    - Recent weather patterns
    - Local market dynamics
    - Supply chain conditions
    Format the response as JSON with prices in INR per quintal.
  `;

  try {
    const response = await fetch(`${ENV.BACKEND_URL}/api/llm/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });

    const data = await response.json();
    return formatLLMResponse(data);
  } catch (error) {
    console.error('LLM error:', error);
    return getDefaultPrices(state);
  }
}

function formatLLMResponse(llmData: any) {
  return Object.entries(CROP_TYPES).map(([key, cropName]) => ({
    crop: cropName,
    price: llmData[key]?.price || getDefaultPrice(key),
    trend: llmData[key]?.trend || 'stable',
    market: 'स्थानीय मंडी',
    advice: llmData[key]?.advice || getDefaultAdvice(key),
    updated: new Date().toLocaleDateString('hi-IN'),
    confidence: llmData[key]?.confidence || 'medium',
    factors: llmData[key]?.factors || []
  }));
}

function getDefaultPrices(state: string) {
  return [
    {
      crop: 'गेहूं',
      price: 2200,
      trend: 'stable',
      market: 'स्थानीय मंडी',
      advice: 'वर्तमान में भाव स्थिर हैं। बाजार की स्थिति के अनुसार निर्णय लें।',
      confidence: 'low',
      factors: ['मौसमी प्रभाव', 'स्थानीय मांग']
    },
    // Add more default prices...
  ];
} 