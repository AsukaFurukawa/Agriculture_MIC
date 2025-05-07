import axios from 'axios';

// For a real app, you would use an actual API key from an environment variable
const WEATHER_API_KEY = 'c6fdf8c40d9547a8a91141828250802';
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/onecall';

// Cache weather data to avoid excessive API calls
const weatherCache = new Map();
const CACHE_EXPIRY_MS = 30 * 60 * 1000; // 30 minutes

interface CachedWeather {
  data: WeatherData;
  timestamp: number;
}

export interface WeatherData {
  current: {
    temp: number;
    feels_like: number;
    humidity: number;
    wind_speed: number;
    weather: {
      main: string;
      description: string;
      icon: string;
    }[];
    uvi: number;
    visibility: number;
    pressure: number;
    dew_point: number;
  };
  daily: {
    dt: number;
    temp: {
      min: number;
      max: number;
      day: number;
    };
    weather: {
      main: string;
      description: string;
      icon: string;
    }[];
    humidity: number;
    wind_speed: number;
    pop: number; // Probability of precipitation
    sunrise: number;
    sunset: number;
  }[];
  hourly: {
    dt: number;
    temp: number;
    weather: {
      main: string;
      description: string;
      icon: string;
    }[];
    pop: number;
  }[];
  alerts?: {
    event: string;
    description: string;
    start: number;
    end: number;
  }[];
  lat: number;
  lon: number;
  timezone: string;
}

export interface FarmingRecommendation {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: 'irrigation' | 'protection' | 'planting' | 'harvesting' | 'general';
  icon: string;
}

/**
 * Fetch weather data for a specific location
 */
export async function getWeatherData(latitude: number, longitude: number): Promise<WeatherData> {
  try {
    // Create a cache key based on coordinates (rounded to 2 decimal places for reasonable caching)
    const cacheKey = `${Math.round(latitude * 100) / 100}_${Math.round(longitude * 100) / 100}`;
    
    // Check if we have valid cached data
    const cachedData = weatherCache.get(cacheKey) as CachedWeather;
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_EXPIRY_MS) {
      console.log('Using cached weather data');
      return cachedData.data;
    }
    
    // Make API request
    const response = await axios.get(WEATHER_API_URL, {
      params: {
        lat: latitude,
        lon: longitude,
        appid: WEATHER_API_KEY,
        units: 'metric',
        exclude: 'minutely',
      }
    });
    
    const weatherData = response.data as WeatherData;
    
    // Cache the data
    weatherCache.set(cacheKey, {
      data: weatherData,
      timestamp: Date.now()
    });
    
    return weatherData;
  } catch (error) {
    console.error('Weather API Error:', error);
    
    // Return mock data if API call fails
    return generateMockWeatherData(latitude, longitude);
  }
}

/**
 * Generate farming-specific weather recommendations based on weather data
 */
export function getFarmingRecommendations(weatherData: WeatherData, cropType?: string): FarmingRecommendation[] {
  const recommendations: FarmingRecommendation[] = [];
  const current = weatherData.current;
  const forecast = weatherData.daily.slice(0, 3); // Next 3 days
  
  // Temperature-based recommendations
  if (current.temp > 35) {
    recommendations.push({
      title: 'High Temperature Alert',
      description: 'Increase irrigation frequency and apply mulch to reduce soil temperature and water evaporation.',
      priority: 'high',
      category: 'irrigation',
      icon: 'thermometer-high'
    });
  } else if (current.temp < 10) {
    recommendations.push({
      title: 'Low Temperature Alert',
      description: 'Protect sensitive crops with row covers or plastic tunnels overnight.',
      priority: 'high',
      category: 'protection',
      icon: 'thermometer-low'
    });
  }
  
  // Rain forecast recommendations
  const rainForecast = forecast.filter(day => 
    day.weather[0].main === 'Rain' || 
    day.weather[0].main === 'Thunderstorm' ||
    day.pop > 0.5
  );
  
  if (rainForecast.length > 0) {
    const rainDay = new Date(rainForecast[0].dt * 1000).toLocaleDateString('en-US', { weekday: 'long' });
    recommendations.push({
      title: 'Rain Expected',
      description: `Rain likely on ${rainDay}. Delay fertilizer application and ensure proper field drainage.`,
      priority: 'medium',
      category: 'general',
      icon: 'weather-pouring'
    });
  } else if (forecast.every(day => day.weather[0].main === 'Clear' || day.weather[0].main === 'Clouds')) {
    recommendations.push({
      title: 'Dry Conditions',
      description: 'No rain expected in the next 3 days. Plan irrigation accordingly and consider early morning watering to minimize evaporation.',
      priority: 'medium',
      category: 'irrigation',
      icon: 'water'
    });
  }
  
  // Humidity-based recommendations
  if (current.humidity > 80) {
    recommendations.push({
      title: 'High Humidity Alert',
      description: 'Increased risk of fungal diseases. Monitor crops and consider preventative fungicide application.',
      priority: 'medium',
      category: 'protection',
      icon: 'water-percent'
    });
  }
  
  // Wind-based recommendations
  if (current.wind_speed > 20) {
    recommendations.push({
      title: 'High Wind Alert',
      description: 'Delay spraying operations and provide support for tall crops. Ensure irrigation systems are secure.',
      priority: 'high',
      category: 'protection',
      icon: 'weather-windy'
    });
  }
  
  // UV-based recommendations
  if (current.uvi > 8) {
    recommendations.push({
      title: 'High UV Alert',
      description: 'Protect workers with appropriate clothing and schedule field work during early morning or late afternoon.',
      priority: 'medium',
      category: 'general',
      icon: 'white-balance-sunny'
    });
  }
  
  // Crop-specific recommendations
  if (cropType) {
    const cropRecommendation = getCropSpecificRecommendation(cropType, weatherData);
    if (cropRecommendation) {
      recommendations.push(cropRecommendation);
    }
  }
  
  // Sort recommendations by priority
  return recommendations.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}

/**
 * Get crop-specific weather recommendations
 */
function getCropSpecificRecommendation(cropType: string, weatherData: WeatherData): FarmingRecommendation | null {
  const cropTypeLower = cropType.toLowerCase();
  const current = weatherData.current;
  
  switch (cropTypeLower) {
    case 'wheat':
      if (current.temp > 30) {
        return {
          title: 'Wheat Heat Stress',
          description: 'Current temperatures may cause heat stress in wheat. Increase irrigation frequency and consider applying light irrigation during the hottest part of the day.',
          priority: 'high',
          category: 'irrigation',
          icon: 'sprout'
        };
      }
      break;
      
    case 'rice':
      if (current.humidity < 60) {
        return {
          title: 'Rice Moisture Alert',
          description: 'Low humidity may affect rice development. Maintain adequate water levels in paddy fields.',
          priority: 'medium',
          category: 'irrigation',
          icon: 'sprout'
        };
      }
      break;
      
    case 'cotton':
      if (weatherData.daily.some(day => day.weather[0].main === 'Rain')) {
        return {
          title: 'Cotton Rain Alert',
          description: 'Upcoming rain may increase risk of boll rot. Monitor crop closely after precipitation.',
          priority: 'medium',
          category: 'protection',
          icon: 'sprout'
        };
      }
      break;
      
    case 'potato':
      if (current.temp < 10 || current.temp > 30) {
        return {
          title: 'Potato Temperature Stress',
          description: 'Current temperatures are outside optimal range for potato growth. Consider additional mulching to regulate soil temperature.',
          priority: 'medium',
          category: 'protection',
          icon: 'sprout'
        };
      }
      break;
      
    default:
      return null;
  }
  
  return null;
}

/**
 * Generate mock weather data for development or when API fails
 */
function generateMockWeatherData(latitude: number, longitude: number): WeatherData {
  // Base temperature on latitude (cooler toward poles)
  const baseTemp = 30 - Math.abs(latitude) * 0.5;
  
  // Generate random temperatures with variance
  const currentTemp = baseTemp + (Math.random() * 10 - 5);
  
  // Weather conditions with weighted randomization
  const weatherConditions = [
    { main: 'Clear', description: 'clear sky', icon: '01d', weight: 0.4 },
    { main: 'Clouds', description: 'few clouds', icon: '02d', weight: 0.3 },
    { main: 'Clouds', description: 'scattered clouds', icon: '03d', weight: 0.1 },
    { main: 'Clouds', description: 'broken clouds', icon: '04d', weight: 0.05 },
    { main: 'Rain', description: 'light rain', icon: '10d', weight: 0.1 },
    { main: 'Rain', description: 'moderate rain', icon: '10d', weight: 0.03 },
    { main: 'Thunderstorm', description: 'thunderstorm', icon: '11d', weight: 0.02 }
  ];
  
  // Select weather based on weighted random
  const randomWeather = () => {
    const random = Math.random();
    let cumulativeWeight = 0;
    
    for (const condition of weatherConditions) {
      cumulativeWeight += condition.weight;
      if (random <= cumulativeWeight) {
        return { 
          main: condition.main, 
          description: condition.description, 
          icon: condition.icon 
        };
      }
    }
    
    return weatherConditions[0]; // Default to clear if something goes wrong
  };
  
  // Generate current weather data
  const currentWeather = randomWeather();
  
  // Generate hourly forecast
  const hourly = Array.from({ length: 24 }, (_, i) => {
    const hourTemp = currentTemp + (Math.random() * 6 - 3) - (i > 12 ? (i - 12) * 0.5 : 0);
    return {
      dt: Math.floor(Date.now() / 1000) + (i * 3600),
      temp: Math.round(hourTemp * 10) / 10,
      weather: [i % 5 === 0 ? randomWeather() : currentWeather], // Change weather every 5 hours
      pop: Math.random() * 0.5 // Probability of precipitation
    };
  });
  
  // Generate daily forecast
  const daily = Array.from({ length: 7 }, (_, i) => {
    const dayTemp = baseTemp + (Math.random() * 10 - 5) - (i > 3 ? (i - 3) * 1 : 0);
    const minTemp = dayTemp - (2 + Math.random() * 3);
    const maxTemp = dayTemp + (2 + Math.random() * 3);
    
    return {
      dt: Math.floor(Date.now() / 1000) + (i * 86400),
      temp: {
        min: Math.round(minTemp * 10) / 10,
        max: Math.round(maxTemp * 10) / 10,
        day: Math.round(dayTemp * 10) / 10
      },
      weather: [i % 2 === 0 ? randomWeather() : currentWeather], // Change weather every other day
      humidity: Math.floor(40 + Math.random() * 40),
      wind_speed: Math.floor(5 + Math.random() * 15),
      pop: Math.random() * 0.7,
      sunrise: Math.floor(Date.now() / 1000) + 21600 + (i * 86400), // Approx 6 AM
      sunset: Math.floor(Date.now() / 1000) + 64800 + (i * 86400)   // Approx 6 PM
    };
  });
  
  // Maybe add an alert
  const alerts = Math.random() > 0.8 ? [{
    event: 'Heavy Rain Warning',
    description: 'Heavy rainfall expected with potential for localized flooding.',
    start: Math.floor(Date.now() / 1000) + 86400,
    end: Math.floor(Date.now() / 1000) + 172800
  }] : undefined;
  
  // Return complete mock weather data
  return {
    current: {
      temp: Math.round(currentTemp * 10) / 10,
      feels_like: Math.round((currentTemp + (Math.random() * 2 - 1)) * 10) / 10,
      humidity: Math.floor(40 + Math.random() * 40),
      wind_speed: Math.floor(5 + Math.random() * 15),
      weather: [currentWeather],
      uvi: Math.floor(Math.random() * 11),
      visibility: 10000 - (currentWeather.main === 'Rain' ? Math.random() * 5000 : 0),
      pressure: Math.floor(1000 + Math.random() * 30),
      dew_point: Math.round((currentTemp - 5 + Math.random() * 3) * 10) / 10
    },
    daily,
    hourly,
    alerts,
    lat: latitude,
    lon: longitude,
    timezone: 'Asia/Kolkata'
  };
}

/**
 * Convert weather data to a human-readable summary for farming context
 */
export function getWeatherSummary(weatherData: WeatherData): string {
  const current = weatherData.current;
  const forecast = weatherData.daily.slice(0, 3);
  
  // Current conditions
  let summary = `Current temperature is ${Math.round(current.temp)}°C with ${current.weather[0].description}. `;
  
  // Tomorrow's forecast
  const tomorrow = forecast[1];
  summary += `Tomorrow: ${Math.round(tomorrow.temp.min)}°C to ${Math.round(tomorrow.temp.max)}°C, ${tomorrow.weather[0].description}. `;
  
  // Rain information
  const rainForecast = forecast.filter(day => 
    day.weather[0].main === 'Rain' || 
    day.weather[0].main === 'Thunderstorm' ||
    day.pop > 0.5
  );
  
  if (rainForecast.length > 0) {
    const rainDays = rainForecast.map(day => 
      new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' })
    ).join(', ');
    summary += `Rain expected on ${rainDays}. `;
  } else {
    summary += 'No significant rainfall expected in the next 3 days. ';
  }
  
  // Add farming context
  if (current.temp > 35) {
    summary += 'Temperatures are high - increase irrigation and avoid midday field operations. ';
  } else if (current.temp < 10) {
    summary += 'Temperatures are low - protect sensitive crops from frost. ';
  }
  
  // Add alerts if any
  if (weatherData.alerts && weatherData.alerts.length > 0) {
    summary += `Weather alert: ${weatherData.alerts[0].event}. `;
  }
  
  return summary;
} 