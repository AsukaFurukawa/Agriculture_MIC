export const getWeatherIcon = (condition: string): string => {
  const lowerCondition = condition.toLowerCase();
  
  if (lowerCondition.includes('rain')) return 'weather-rainy';
  if (lowerCondition.includes('cloud')) return 'weather-cloudy';
  if (lowerCondition.includes('sun') || lowerCondition.includes('clear')) return 'weather-sunny';
  if (lowerCondition.includes('thunder')) return 'weather-lightning';
  if (lowerCondition.includes('snow')) return 'weather-snowy';
  if (lowerCondition.includes('fog') || lowerCondition.includes('mist')) return 'weather-fog';
  
  return 'weather-partly-cloudy';
};

export const getWeatherIconFromCondition = (condition: string): string => {
  // This function returns the same icon as getWeatherIcon but can be extended
  // to handle more specific conditions or different icon sets
  return getWeatherIcon(condition);
}; 