import axios from 'axios';

// In a real app, you would use an API key from environment variables
const MARKET_API_KEY = 'YOUR_MARKET_API_KEY';
const MARKET_API_URL = 'https://api.example.com/market-data'; // Example API URL

// Cache for market data
const marketDataCache = new Map();
const CACHE_EXPIRY_MS = 60 * 60 * 1000; // 1 hour cache expiry

interface CachedMarketData {
  data: MarketData;
  timestamp: number;
}

export interface CropPrice {
  id: string;
  name: string;
  scientificName?: string;
  pricePerQuintal: number;
  currency: string;
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
  lastWeekPrice?: number;
  lastMonthPrice?: number;
  mspPrice?: number; // Minimum Support Price (if applicable)
  quality?: string;
  grade?: string;
  demandForecast?: 'High' | 'Medium' | 'Low';
  availabilityLevel?: 'High' | 'Medium' | 'Low';
  varieties?: {
    name: string;
    price: number;
    quality: string;
  }[];
}

export interface Market {
  id: string;
  name: string;
  distance: string; // Distance from user's location
  distanceKm: number;
  location: {
    state: string;
    district: string;
    address: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  tradingHours: string;
  tradingDays: string;
  contactNumber?: string;
  website?: string;
  facilities: string[];
  transportOptions?: string[];
  volumeLevel?: 'High' | 'Medium' | 'Low';
}

export interface MarketTrend {
  cropId: string;
  cropName: string;
  monthlyPrices: {
    month: string;
    price: number;
  }[];
  seasonalHighMonth?: string;
  seasonalLowMonth?: string;
  yearOverYearChange?: number;
  forecastNextMonth?: string;
  forecastNextQuarter?: string;
}

export interface BuyerInfo {
  id: string;
  name: string;
  type: 'Processor' | 'Wholesaler' | 'Retailer' | 'Exporter' | 'Government';
  crops: string[];
  location: string;
  contactPerson?: string;
  contactNumber?: string;
  email?: string;
  offerPrice?: string;
  paymentTerms?: string;
  minQuantity?: string;
}

export interface MarketData {
  crops: CropPrice[];
  markets: Market[];
  trends: MarketTrend[];
  buyers: BuyerInfo[];
  dateUpdated: string;
  region: {
    state: string;
    district?: string;
  };
}

export interface SellRecommendation {
  cropId: string;
  cropName: string;
  recommendation: 'sell' | 'wait' | 'partial';
  reasoning: string;
  bestMarketId?: string;
  bestMarketName?: string;
  bestBuyerId?: string;
  bestBuyerName?: string;
  expectedPriceChange?: string;
  confidenceLevel: 'High' | 'Medium' | 'Low';
}

/**
 * Get market data for a specific region
 */
export async function getMarketData(
  state: string, 
  district?: string
): Promise<MarketData> {
  try {
    // Create a cache key
    const cacheKey = `${state}_${district || ''}`;
    
    // Check if we have valid cached data
    const cachedData = marketDataCache.get(cacheKey) as CachedMarketData;
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_EXPIRY_MS) {
      console.log('Using cached market data');
      return cachedData.data;
    }
    
    // Make API request
    const response = await axios.get(MARKET_API_URL, {
      params: {
        state,
        district,
        key: MARKET_API_KEY
      }
    });
    
    const marketData = response.data as MarketData;
    
    // Cache the data
    marketDataCache.set(cacheKey, {
      data: marketData,
      timestamp: Date.now()
    });
    
    return marketData;
  } catch (error) {
    console.error('Market API Error:', error);
    
    // Return mock data if API call fails
    return generateMockMarketData(state, district);
  }
}

/**
 * Get selling recommendations based on market data and crop type
 */
export function getSellRecommendations(
  marketData: MarketData,
  cropTypes: string[] = []
): SellRecommendation[] {
  const recommendations: SellRecommendation[] = [];
  
  if (!marketData || !marketData.crops || marketData.crops.length === 0) {
    return recommendations;
  }
  
  // Filter crops if specific crop types were requested
  const cropsToAnalyze = cropTypes.length > 0
    ? marketData.crops.filter(crop => 
        cropTypes.some(cropType => 
          crop.name.toLowerCase().includes(cropType.toLowerCase())
        )
      )
    : marketData.crops;
  
  // Generate recommendations for each crop
  cropsToAnalyze.forEach(crop => {
    // Find trend data for this crop
    const trendData = marketData.trends.find(trend => 
      trend.cropId === crop.id || trend.cropName.toLowerCase() === crop.name.toLowerCase()
    );
    
    // Find best market for this crop
    const bestMarket = findBestMarketForCrop(crop, marketData.markets);
    
    // Find best buyer for this crop
    const bestBuyer = findBestBuyerForCrop(crop, marketData.buyers);
    
    // Determine recommendation type
    let recommendation: 'sell' | 'wait' | 'partial' = 'wait';
    let reasoning = '';
    let confidenceLevel: 'High' | 'Medium' | 'Low' = 'Medium';
    
    // Logic for determining if now is a good time to sell
    if (crop.trend === 'up' && crop.changePercent > 5) {
      // Price is increasing rapidly
      recommendation = 'partial';
      reasoning = `Prices are rising quickly (+${crop.changePercent}%). Consider selling a portion now and holding the rest for potentially higher prices.`;
      confidenceLevel = 'Medium';
    } else if (crop.trend === 'up' && crop.changePercent <= 5) {
      // Price is increasing slowly
      recommendation = 'wait';
      reasoning = `Prices are trending upward (+${crop.changePercent}%), but the increase is gradual. Consider waiting for better prices.`;
      confidenceLevel = 'Medium';
    } else if (crop.trend === 'down' && crop.changePercent > 5) {
      // Price is decreasing rapidly
      recommendation = 'sell';
      reasoning = `Prices are falling significantly (-${Math.abs(crop.changePercent)}%). Consider selling soon to avoid further losses.`;
      confidenceLevel = 'High';
    } else if (crop.trend === 'down' && crop.changePercent <= 5) {
      // Price is decreasing slowly
      recommendation = 'partial';
      reasoning = `Prices are trending downward slightly (-${Math.abs(crop.changePercent)}%). Consider selling a portion now.`;
      confidenceLevel = 'Medium';
    } else {
      // Price is stable
      recommendation = 'wait';
      reasoning = `Prices are stable (${crop.changePercent}% change). Monitor market trends for better selling opportunities.`;
      confidenceLevel = 'Low';
    }
    
    // Check if current price is higher than MSP by a significant margin
    if (crop.mspPrice && crop.pricePerQuintal > (crop.mspPrice * 1.15)) {
      recommendation = 'sell';
      reasoning = `Current price (₹${crop.pricePerQuintal}) is significantly higher than MSP (₹${crop.mspPrice}). Good opportunity to sell.`;
      confidenceLevel = 'High';
    }
    
    // Use seasonal data if available
    if (trendData && trendData.seasonalHighMonth) {
      const currentMonth = new Date().getMonth();
      const highMonth = getMonthNumber(trendData.seasonalHighMonth);
      
      if (currentMonth === highMonth) {
        recommendation = 'sell';
        reasoning = `Current month (${trendData.seasonalHighMonth}) typically offers the highest prices of the year for ${crop.name}. Good time to sell.`;
        confidenceLevel = 'High';
      } else if (Math.abs(currentMonth - highMonth) <= 1 || Math.abs(currentMonth - highMonth) >= 11) {
        // Within one month of the seasonal high
        recommendation = 'partial';
        reasoning = `We're approaching ${trendData.seasonalHighMonth}, which typically offers the highest prices for ${crop.name}. Consider selling a portion now.`;
        confidenceLevel = 'Medium';
      }
    }
    
    // Add market and buyer info to reasoning if available
    if (bestMarket) {
      reasoning += ` ${bestMarket.name} (${bestMarket.distance} away) currently offers the best prices.`;
    }
    
    if (bestBuyer) {
      reasoning += ` ${bestBuyer.name} is buying ${crop.name} with favorable terms.`;
    }
    
    // Create the recommendation
    recommendations.push({
      cropId: crop.id,
      cropName: crop.name,
      recommendation,
      reasoning,
      bestMarketId: bestMarket?.id,
      bestMarketName: bestMarket?.name,
      bestBuyerId: bestBuyer?.id,
      bestBuyerName: bestBuyer?.name,
      expectedPriceChange: getExpectedPriceChange(crop, trendData),
      confidenceLevel
    });
  });
  
  // Sort recommendations by confidence level
  return recommendations.sort((a, b) => {
    const confidenceOrder = { 'High': 0, 'Medium': 1, 'Low': 2 };
    return confidenceOrder[a.confidenceLevel] - confidenceOrder[b.confidenceLevel];
  });
}

/**
 * Find the best market for a specific crop based on price and distance
 */
function findBestMarketForCrop(crop: CropPrice, markets: Market[]): Market | undefined {
  // In a real app, this would include more sophisticated logic based on
  // price data at each market and optimizing the price-to-distance ratio
  
  // For this example, we'll just return the closest market
  if (!markets || markets.length === 0) return undefined;
  
  // Sort by distance
  return markets.sort((a, b) => a.distanceKm - b.distanceKm)[0];
}

/**
 * Find the best buyer for a specific crop based on offer terms
 */
function findBestBuyerForCrop(crop: CropPrice, buyers: BuyerInfo[]): BuyerInfo | undefined {
  if (!buyers || buyers.length === 0) return undefined;
  
  // Filter buyers that purchase this crop
  const relevantBuyers = buyers.filter(buyer => 
    buyer.crops.some(c => c.toLowerCase() === crop.name.toLowerCase())
  );
  
  if (relevantBuyers.length === 0) return undefined;
  
  // For this simple example, just return the first relevant buyer
  // In a real app, this would include more sophisticated logic based on
  // offer prices, payment terms, etc.
  return relevantBuyers[0];
}

/**
 * Generate expected price change text based on trends
 */
function getExpectedPriceChange(crop: CropPrice, trend?: MarketTrend): string {
  if (!trend) {
    // Use simple trend data if detailed trend not available
    if (crop.trend === 'up') {
      return `Expected to rise by approximately ${crop.changePercent}% in the near term`;
    } else if (crop.trend === 'down') {
      return `Expected to fall by approximately ${Math.abs(crop.changePercent)}% in the near term`;
    } else {
      return 'Prices expected to remain stable in the near term';
    }
  }
  
  // Use detailed forecast if available
  if (trend.forecastNextMonth) {
    return trend.forecastNextMonth;
  }
  
  return 'Price forecast unavailable';
}

/**
 * Convert month name to month number (0-11)
 */
function getMonthNumber(monthName: string): number {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  return months.findIndex(m => monthName.toLowerCase().includes(m.toLowerCase()));
}

/**
 * Generate mock market data when the API fails
 */
function generateMockMarketData(state: string, district?: string): MarketData {
  // Common crops in India
  const cropsList = [
    { name: 'Wheat', scientificName: 'Triticum aestivum', basePrice: 2000, trend: getRandomTrend() },
    { name: 'Rice', scientificName: 'Oryza sativa', basePrice: 1800, trend: getRandomTrend() },
    { name: 'Cotton', scientificName: 'Gossypium hirsutum', basePrice: 5500, trend: getRandomTrend() },
    { name: 'Sugarcane', scientificName: 'Saccharum officinarum', basePrice: 350, trend: getRandomTrend() },
    { name: 'Maize', scientificName: 'Zea mays', basePrice: 1900, trend: getRandomTrend() },
    { name: 'Soybean', scientificName: 'Glycine max', basePrice: 4000, trend: getRandomTrend() },
    { name: 'Potato', scientificName: 'Solanum tuberosum', basePrice: 1200, trend: getRandomTrend() },
    { name: 'Onion', scientificName: 'Allium cepa', basePrice: 1400, trend: getRandomTrend() },
    { name: 'Tomato', scientificName: 'Solanum lycopersicum', basePrice: 1500, trend: getRandomTrend() },
    { name: 'Mustard', scientificName: 'Brassica juncea', basePrice: 4600, trend: getRandomTrend() }
  ];
  
  // Generate crop price data
  const crops: CropPrice[] = cropsList.map((crop, index) => {
    const priceVariance = (Math.random() * 0.2) - 0.1; // -10% to +10%
    const basePrice = crop.basePrice;
    const currentPrice = Math.round(basePrice * (1 + priceVariance));
    
    const trend = crop.trend;
    const changePercent = trend === 'up' 
      ? Math.round((Math.random() * 8) + 1) 
      : trend === 'down' 
        ? -Math.round((Math.random() * 8) + 1)
        : Math.round((Math.random() * 2) - 1);
    
    const lastWeekPrice = Math.round(currentPrice * (1 - (changePercent / 100)));
    const lastMonthPrice = Math.round(lastWeekPrice * (1 - (changePercent / 100)));
    
    // Determine if MSP is applicable for this crop
    const hasMsp = ['Wheat', 'Rice', 'Cotton', 'Sugarcane', 'Soybean', 'Mustard'].includes(crop.name);
    const mspPrice = hasMsp ? Math.round(basePrice * 0.85) : undefined; // MSP is typically lower than market price
    
    return {
      id: `crop_${index + 1}`,
      name: crop.name,
      scientificName: crop.scientificName,
      pricePerQuintal: currentPrice,
      currency: 'INR',
      trend: trend,
      changePercent: changePercent,
      lastWeekPrice,
      lastMonthPrice,
      mspPrice,
      quality: Math.random() > 0.5 ? 'Premium' : 'Standard',
      grade: ['A', 'B', 'C'][Math.floor(Math.random() * 3)],
      demandForecast: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)] as 'High' | 'Medium' | 'Low',
      availabilityLevel: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)] as 'High' | 'Medium' | 'Low',
      varieties: [
        {
          name: `${crop.name} (Premium)`,
          price: Math.round(currentPrice * 1.15),
          quality: 'Premium'
        },
        {
          name: `${crop.name} (Standard)`,
          price: currentPrice,
          quality: 'Standard'
        }
      ]
    };
  });
  
  // Generate nearby markets
  const markets: Market[] = [
    {
      id: 'market_1',
      name: district ? `${district} Mandi` : `${state} Agricultural Market`,
      distance: '5 km',
      distanceKm: 5,
      location: {
        state,
        district: district || '',
        address: `Main Market Road, ${district || state}`
      },
      tradingHours: '6:00 AM - 2:00 PM',
      tradingDays: 'Monday - Saturday',
      contactNumber: '+91 98765 43210',
      facilities: ['Electronic weighing', 'Storage facility', 'Payment within 24 hours'],
      transportOptions: ['Truck', 'Tractor-trolley available for hire'],
      volumeLevel: 'High'
    },
    {
      id: 'market_2',
      name: 'Regional Farmers Market',
      distance: '15 km',
      distanceKm: 15,
      location: {
        state,
        district: district || '',
        address: `Highway Junction, ${district || state}`
      },
      tradingHours: '7:00 AM - 4:00 PM',
      tradingDays: 'Monday - Saturday',
      contactNumber: '+91 94321 56789',
      facilities: ['Electronic weighing', 'Quality testing', 'Direct buyer connections'],
      transportOptions: ['Truck', 'Mini-truck available for hire'],
      volumeLevel: 'Medium'
    },
    {
      id: 'market_3',
      name: 'State Agricultural Hub',
      distance: '25 km',
      distanceKm: 25,
      location: {
        state,
        district: district || '',
        address: `Industrial Area, ${state}`
      },
      tradingHours: '8:00 AM - 6:00 PM',
      tradingDays: 'Monday - Sunday',
      contactNumber: '+91 87654 32109',
      facilities: ['Storage facility', 'Processing units', 'Export facilities', 'Banking services'],
      transportOptions: ['Railway connection', 'Truck terminal nearby'],
      volumeLevel: 'High'
    }
  ];
  
  // Generate market trends
  const trends: MarketTrend[] = crops.map((crop, index) => {
    // Generate monthly price data for the past 6 months
    const basePrice = crop.pricePerQuintal;
    const monthlyPrices = [];
    
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const currentMonth = new Date().getMonth();
    
    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      
      // Add some cyclical and random variation
      const cyclicalVariation = Math.sin((monthIndex / 12) * Math.PI * 2) * 0.1;
      const randomVariation = (Math.random() * 0.1) - 0.05;
      
      const variationFactor = 1 + cyclicalVariation + randomVariation;
      const monthPrice = Math.round(basePrice * variationFactor);
      
      monthlyPrices.push({
        month: months[monthIndex],
        price: monthPrice
      });
    }
    
    // Determine seasonal high and low months
    const highMonthIndex = Math.floor(Math.random() * 12);
    let lowMonthIndex = (highMonthIndex + 6) % 12;
    
    // Generate forecasts
    const priceTrend = Math.random() > 0.5 ? 'rise' : 'fall';
    const priceChangePercent = Math.floor(Math.random() * 10) + 1;
    
    return {
      cropId: crop.id,
      cropName: crop.name,
      monthlyPrices,
      seasonalHighMonth: months[highMonthIndex],
      seasonalLowMonth: months[lowMonthIndex],
      yearOverYearChange: Math.floor(Math.random() * 20) - 10,
      forecastNextMonth: `Prices expected to ${priceTrend} by ${priceChangePercent}% next month based on seasonal patterns`,
      forecastNextQuarter: `Market outlook for next quarter: ${Math.random() > 0.5 ? 'Positive' : 'Stable'}`
    };
  });
  
  // Generate buyers
  const buyers: BuyerInfo[] = [
    {
      id: 'buyer_1',
      name: 'Agro Processing Ltd',
      type: 'Processor',
      crops: ['Wheat', 'Rice'],
      location: `${district || state}`,
      contactPerson: 'Mr. Sharma',
      contactNumber: '+91 98765 43210',
      offerPrice: 'Premium +2% above market rate',
      paymentTerms: 'Immediate payment via bank transfer',
      minQuantity: '1 ton'
    },
    {
      id: 'buyer_2',
      name: 'Regional Food Corporation',
      type: 'Government',
      crops: ['Wheat', 'Rice', 'Soybean'],
      location: `${state} Capital`,
      contactPerson: 'Mrs. Patel',
      contactNumber: '+91 94321 56789',
      offerPrice: 'At MSP or market rate, whichever is higher',
      paymentTerms: 'Payment within 3 days via bank transfer',
      minQuantity: '500 kg'
    },
    {
      id: 'buyer_3',
      name: 'Export Trading Co.',
      type: 'Exporter',
      crops: ['Cotton', 'Soybean', 'Onion'],
      location: `${state} Export Zone`,
      contactPerson: 'Mr. Gupta',
      contactNumber: '+91 87654 32109',
      offerPrice: 'Based on quality assessment, premium for export quality',
      paymentTerms: 'Payment within 7 days',
      minQuantity: '2 tons'
    }
  ];
  
  return {
    crops,
    markets,
    trends,
    buyers,
    dateUpdated: new Date().toISOString(),
    region: {
      state,
      district
    }
  };
}

/**
 * Generate a random price trend
 */
function getRandomTrend(): 'up' | 'down' | 'stable' {
  const rand = Math.random();
  if (rand < 0.4) return 'up';
  if (rand < 0.8) return 'down';
  return 'stable';
}

/**
 * Get a price summary for a specific crop
 */
export function getCropPriceSummary(cropName: string, marketData: MarketData): string {
  const crop = marketData.crops.find(c => 
    c.name.toLowerCase() === cropName.toLowerCase()
  );
  
  if (!crop) {
    return `No price information available for ${cropName}.`;
  }
  
  // Find trend data for this crop
  const trendData = marketData.trends.find(trend => 
    trend.cropId === crop.id || trend.cropName.toLowerCase() === crop.name.toLowerCase()
  );
  
  let summary = `Current ${crop.name} price: ₹${crop.pricePerQuintal} per quintal. `;
  
  if (crop.trend === 'up') {
    summary += `Prices are rising (${crop.changePercent}% increase). `;
  } else if (crop.trend === 'down') {
    summary += `Prices are falling (${Math.abs(crop.changePercent)}% decrease). `;
  } else {
    summary += `Prices are stable. `;
  }
  
  if (crop.lastWeekPrice) {
    summary += `Last week's price: ₹${crop.lastWeekPrice}. `;
  }
  
  if (crop.mspPrice) {
    summary += `MSP: ₹${crop.mspPrice}. `;
  }
  
  // Add seasonal information if available
  if (trendData && trendData.seasonalHighMonth) {
    summary += `Prices typically peak in ${trendData.seasonalHighMonth}. `;
  }
  
  // Add recommendation
  const recommendations = getSellRecommendations(marketData, [cropName]);
  if (recommendations.length > 0) {
    const rec = recommendations[0];
    if (rec.recommendation === 'sell') {
      summary += 'Recommendation: Good time to sell. ';
    } else if (rec.recommendation === 'wait') {
      summary += 'Recommendation: Consider waiting for better prices. ';
    } else {
      summary += 'Recommendation: Consider selling a portion now. ';
    }
  }
  
  return summary;
} 