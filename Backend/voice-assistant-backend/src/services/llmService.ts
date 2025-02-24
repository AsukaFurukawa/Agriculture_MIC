import { CROP_TYPES, ENV } from '../config/env';

type CropType = keyof typeof CROP_TYPES;
type CropResponse = {
  price: number;
  trend: 'up' | 'down';
  confidence: 'high' | 'medium' | 'low';
  advice: string;
  factors: string[];
};

// Simplified LLM service for testing
export const llmService = {
  getPrediction: async (prompt: string) => {
    const response: Record<CropType, CropResponse> = {} as Record<CropType, CropResponse>;
    
    (Object.keys(CROP_TYPES) as CropType[]).forEach(crop => {
      const basePrice = getBasePrice(crop);
      response[crop] = {
        price: basePrice + Math.random() * (basePrice * 0.1), // 10% variation
        trend: Math.random() > 0.5 ? 'up' : 'down',
        confidence: getConfidence(),
        advice: getRandomAdvice(crop),
        factors: getRandomFactors()
      };
    });

    return response;
  }
};

function getBasePrice(crop: CropType): number {
  const prices: Record<CropType, number> = {
    WHEAT: 2200,
    RICE: 3000,
    COTTON: 6000,
    SUGARCANE: 350,
    POTATO: 1500,
    ONION: 2000,
    TOMATO: 2500,
    SOYBEAN: 4000,
    MUSTARD: 5500,
    CORN: 1800
  };
  return prices[crop] || 2000;
}

function getConfidence(): 'high' | 'medium' | 'low' {
  const random = Math.random();
  if (random > 0.7) return 'high';
  if (random > 0.3) return 'medium';
  return 'low';
}

function getRandomAdvice(crop: CropType): string {
  const advices = [
    `${CROP_TYPES[crop]} के भाव में वृद्धि की संभावना है`,
    `${CROP_TYPES[crop]} की मांग स्थिर है`,
    `${CROP_TYPES[crop]} का बाज़ार सकारात्मक दिख रहा है`,
    `${CROP_TYPES[crop]} की फसल के लिए मौसम अनुकूल है`
  ];
  return advices[Math.floor(Math.random() * advices.length)];
}

function getRandomFactors(): string[] {
  const allFactors = [
    'मौसम की स्थिति अनुकूल',
    'अंतर्राष्ट्रीय मांग',
    'स्थानीय मांग में वृद्धि',
    'सरकारी नीतियां',
    'भंडारण की उपलब्धता',
    'परिवहन लागत',
    'निर्यात संभावनाएं',
    'मंडी में आवक'
  ];
  
  // Return 3 random factors
  return allFactors
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
} 