const WEATHER_API_KEY = 'c6fdf8c40d9547a8a91141828250802';

export const weatherService = {
  async getCurrentWeather(lat: number, lon: number) {
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
        advice: generateFarmingAdvice(data.current),
      };
    } catch (error) {
      console.error('Weather service error:', error);
      throw error;
    }
  },

  async getForecast(lat: number, lon: number) {
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
  }
};

function generateFarmingAdvice(weather: any) {
  const advices = [];

  if (weather.temp_c > 35) {
    advices.push('गर्मी ज्यादा है, सुबह या शाम को काम करें।');
  }
  if (weather.humidity > 80) {
    advices.push('नमी ज्यादा है, फसल में फंगस से बचाव करें।');
  }
  if (weather.wind_kph > 20) {
    advices.push('तेज हवा चल रही है, छिड़काव का काम टाल दें।');
  }

  return advices.join(' ');
} 