import { llmService } from './llmService';

interface AnalysisParams {
  landSize: number;
  location: {
    lat: number;
    lon: number;
    state: string;
    district: string;
  };
  soilType?: string;
  irrigationAvailable?: boolean;
}

interface CropRotationPlan {
  season: 'खरीफ' | 'रबी' | 'जायद';
  primaryCrop: string;
  companionCrops: string[];
  nextSeasonSuggestion: string;
  soilBenefits: string[];
}

export const cropAnalysisService = {
  async analyzeBestCrops(params: AnalysisParams) {
    try {
      // Get all required data in parallel
      const [weather, market, soil] = await Promise.all([
        weatherService.getForecast(params.location.lat, params.location.lon),
        marketService.getPriceTrends(),
        getSoilData(params.location)
      ]);

      // Calculate profitability for each crop
      const cropAnalysis = await calculateCropProfitability({
        landSize: params.landSize,
        weather,
        market,
        soil,
        location: params.location
      });

      // Get government schemes
      const schemes = await getGovernmentSchemes(params.location.state);

      // Generate final recommendations
      return generateRecommendations(cropAnalysis, schemes);
    } catch (error) {
      console.error('Crop analysis error:', error);
      throw error;
    }
  },

  async getAIRecommendations(data: any) {
    const prompt = `
      Analyze best crops for farming with these conditions:
      - Land size: ${data.landSize} acres
      - Location: ${data.location.district}, ${data.location.state}
      - Season: ${data.weather.season}
      - Average rainfall: ${data.weather.rainfall}mm
      - Soil type: ${data.soil.type}
      - Market trends: ${JSON.stringify(data.market)}
      
      Provide recommendations in Hindi with:
      1. Top 3 suitable crops
      2. Expected profit per acre
      3. Risk factors
      4. Farming tips
    `;

    try {
      const llmResponse = await llmService.getPrediction(prompt);
      
      // Enhance our data-driven recommendations with AI insights
      return {
        ...data,
        aiSuggestions: llmResponse.suggestions,
        farmingTips: llmResponse.tips,
        marketInsights: llmResponse.marketAnalysis
      };
    } catch (error) {
      console.log('Falling back to basic recommendations');
      return data;
    }
  },

  async getYearlyPlan(data: any) {
    const prompt = `
      Create a year-round farming plan for:
      - Land: ${data.landSize} acres in ${data.location.district}
      - Current season: ${data.weather.season}
      - Soil health: ${data.soil.health}
      
      Consider:
      1. Crop rotation benefits
      2. Companion planting
      3. Soil nutrition
      4. Local market demand
      5. Traditional farming knowledge
    `;

    try {
      const llmResponse = await llmService.getPrediction(prompt);
      
      const yearPlan: CropRotationPlan[] = [
        {
          season: 'खरीफ',
          primaryCrop: 'धान',
          companionCrops: ['दाल', 'मूंगफली'],
          nextSeasonSuggestion: 'गेहूं',
          soilBenefits: [
            'नाइट्रोजन स्थिरीकरण',
            'मिट्टी की उर्वरता में सुधार'
          ]
        },
        {
          season: 'रबी',
          primaryCrop: 'गेहूं',
          companionCrops: ['सरसों', 'मटर'],
          nextSeasonSuggestion: 'मूंग',
          soilBenefits: [
            'मिट्टी की बनावट में सुधार',
            'खरपतवार नियंत्रण'
          ]
        },
        // Add जायद (summer) season recommendations
      ];

      // Enhance with AI insights
      return {
        yearPlan,
        aiSuggestions: llmResponse.suggestions,
        organicTips: llmResponse.organicFarming,
        waterConservation: llmResponse.waterTips
      };
    } catch (error) {
      console.log('Falling back to basic rotation plan');
      return getDefaultRotationPlan(data);
    }
  },

  async getOrganicFarmingTips(crop: string) {
    const prompt = `
      Provide organic farming tips for ${crop} including:
      1. Natural pest control
      2. Organic fertilizers
      3. Traditional farming methods
      4. Water conservation
    `;

    try {
      const tips = await llmService.getPrediction(prompt);
      return {
        naturalPestControl: tips.pestControl,
        organicFertilizers: tips.fertilizers,
        traditionalMethods: tips.traditional,
        waterSaving: tips.water
      };
    } catch (error) {
      return getDefaultOrganicTips(crop);
    }
  }
};

function calculateCropProfitability(data: any) {
  const profitability = [];
  
  for (const crop of SUITABLE_CROPS) {
    const analysis = {
      cropName: crop,
      investment: calculateInvestment(crop, data.landSize),
      expectedYield: calculateYield(crop, data.weather, data.soil),
      marketPrice: predictPrice(crop, data.market),
      risk: assessRisk(crop, data.weather, data.market),
      reasons: []
    };

    // Add reasons for recommendation
    if (data.weather.rainfall > crop.waterRequirement) {
      analysis.reasons.push('वर्षा की मात्रा अनुकूल है');
    }
    if (data.market.demand[crop.name] === 'HIGH') {
      analysis.reasons.push('बाजार में मांग अधिक है');
    }

    profitability.push(analysis);
  }

  return profitability.sort((a, b) => b.profit - a.profit);
} 