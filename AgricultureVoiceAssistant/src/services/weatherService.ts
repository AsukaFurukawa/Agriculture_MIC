import { ENV } from '../config/env';

const WEATHER_API_KEY = 'c6fdf8c40d9547a8a91141828250802';

export const weatherService = {
  getCurrentWeather: async (lat: number, lon: number) => {
    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${lat},${lon}&days=1&aqi=yes&alerts=yes`
      );
      const data = await response.json();
      
      return {
        temperature: Math.round(data.current.temp_c),
        humidity: data.current.humidity,
        rainProbability: data.forecast.forecastday[0].day.daily_chance_of_rain,
        windSpeed: data.current.wind_kph,
        condition: data.current.condition.text,
        farmingAdvice: generateFarmingAdvice({
          temp: data.current.temp_c,
          humidity: data.current.humidity,
          condition: data.current.condition.text,
          windSpeed: data.current.wind_kph,
          rainChance: data.forecast.forecastday[0].day.daily_chance_of_rain
        }),
      };
    } catch (error) {
      console.error('Weather service error:', error);
      throw error;
    }
  },

  getForecast: async (lat: number, lon: number) => {
    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${lat},${lon}&days=7&aqi=yes`
      );
      const data = await response.json();
      
      return data.forecast.forecastday.map((day: any) => ({
        date: day.date,
        maxTemp: day.day.maxtemp_c,
        minTemp: day.day.mintemp_c,
        rainChance: day.day.daily_chance_of_rain,
        condition: day.day.condition.text,
        humidity: day.day.avghumidity,
      }));
    } catch (error) {
      console.error('Forecast error:', error);
      throw error;
    }
  },
};

interface WeatherCondition {
  temp: number;
  humidity: number;
  condition: string;
  windSpeed: number;
  rainChance: number;
}

function generateFarmingAdvice(weather: WeatherCondition): string {
  const advices: string[] = [];

  // Temperature based advice
  if (weather.temp > 35) {
    advices.push('गर्मी ज्यादा है, सुबह या शाम को काम करें।');
  } else if (weather.temp < 10) {
    advices.push('ठंड से फसलों को बचाएं।');
  }

  // Rain probability based advice
  if (weather.rainChance > 70) {
    advices.push('आज बारिश की संभावना अधिक है, फसल की सुरक्षा करें।');
  } else if (weather.rainChance > 30) {
    advices.push('हल्की बारिश की संभावना है।');
  }

  // Humidity based advice
  if (weather.humidity > 80) {
    advices.push('नमी ज्यादा है, फसल में फंगस से बचाव करें।');
  } else if (weather.humidity < 30) {
    advices.push('हवा में नमी कम है, सिंचाई की आवश्यकता हो सकती है।');
  }

  // Wind speed based advice
  if (weather.windSpeed > 20) {
    advices.push('तेज हवा चल रही है, छिड़काव का काम टाल दें।');
  }

  // Condition based advice
  if (weather.condition.toLowerCase().includes('rain')) {
    advices.push('बारिश के कारण खेत में काम करने की सलाह नहीं है।');
  }

  return advices.join(' ');
} 