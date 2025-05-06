import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { useWebAppContext } from '../contexts/WebAppContext';

export default function WeatherPage() {
  const { weatherData, locationName } = useWebAppContext();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading || !weatherData) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading weather data...</Text>
      </View>
    );
  }
  
  const getWeatherIcon = (condition) => {
    switch(condition.toLowerCase()) {
      case 'clear':
        return '☀️';
      case 'partly cloudy':
        return '⛅';
      case 'cloudy':
        return '☁️';
      case 'light rain':
        return '🌦️';
      case 'rain':
        return '🌧️';
      default:
        return '🌤️';
    }
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Weather Forecast</Text>
        <Text style={styles.headerSubtitle}>{locationName}</Text>
      </View>
      
      <View style={styles.currentWeather}>
        <View style={styles.weatherIconContainer}>
          <Text style={styles.weatherIcon}>{getWeatherIcon(weatherData.condition)}</Text>
        </View>
        <View style={styles.weatherDetails}>
          <Text style={styles.temperature}>{weatherData.temperature}°C</Text>
          <Text style={styles.condition}>{weatherData.condition}</Text>
          <View style={styles.extraInfo}>
            <Text style={styles.extraInfoText}>Humidity: {weatherData.humidity}%</Text>
            <Text style={styles.extraInfoText}>Wind: {weatherData.windSpeed} km/h</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.forecastSection}>
        <Text style={styles.sectionTitle}>3-Day Forecast</Text>
        <View style={styles.forecastContainer}>
          {weatherData.forecast.map((day, index) => (
            <View key={index} style={styles.forecastCard}>
              <Text style={styles.forecastDay}>{day.day}</Text>
              <Text style={styles.forecastIcon}>{getWeatherIcon(day.condition)}</Text>
              <Text style={styles.forecastTemp}>{day.temp}°C</Text>
              <Text style={styles.forecastCondition}>{day.condition}</Text>
            </View>
          ))}
        </View>
      </View>
      
      <View style={styles.farmingTipsSection}>
        <Text style={styles.sectionTitle}>Weather-Based Farming Tips</Text>
        <View style={styles.tipsContainer}>
          {weatherData.condition.toLowerCase().includes('rain') ? (
            <View style={styles.tipCard}>
              <Text style={styles.tipTitle}>Rainy Weather</Text>
              <Text style={styles.tipText}>Avoid applying fertilizers as they might wash away. Ensure proper drainage in your fields to prevent waterlogging.</Text>
            </View>
          ) : weatherData.condition.toLowerCase().includes('clear') ? (
            <View style={styles.tipCard}>
              <Text style={styles.tipTitle}>Clear Weather</Text>
              <Text style={styles.tipText}>Ideal time for applying fertilizers and pesticides. Consider irrigation planning as clear skies can lead to higher evaporation.</Text>
            </View>
          ) : (
            <View style={styles.tipCard}>
              <Text style={styles.tipTitle}>Cloudy Weather</Text>
              <Text style={styles.tipText}>Good time for transplanting seedlings. Monitor humidity levels as they can affect pest infestations.</Text>
            </View>
          )}
          
          {weatherData.temperature > 30 ? (
            <View style={styles.tipCard}>
              <Text style={styles.tipTitle}>High Temperature</Text>
              <Text style={styles.tipText}>Increase irrigation frequency. Provide shade for sensitive crops. Avoid midday field operations.</Text>
            </View>
          ) : weatherData.temperature < 20 ? (
            <View style={styles.tipCard}>
              <Text style={styles.tipTitle}>Low Temperature</Text>
              <Text style={styles.tipText}>Protect frost-sensitive crops. Delay irrigation to warmer hours of the day.</Text>
            </View>
          ) : (
            <View style={styles.tipCard}>
              <Text style={styles.tipTitle}>Moderate Temperature</Text>
              <Text style={styles.tipText}>Optimal conditions for most field activities. Good time for sowing new crops and field maintenance.</Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 18,
    color: '#6B7280',
  },
  header: {
    backgroundColor: '#3B82F6',
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  currentWeather: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  weatherIconContainer: {
    width: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    padding: 16,
  },
  weatherIcon: {
    fontSize: 64,
  },
  weatherDetails: {
    flex: 1,
    padding: 16,
  },
  temperature: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  condition: {
    fontSize: 18,
    color: '#4B5563',
    marginBottom: 8,
  },
  extraInfo: {
    marginTop: 8,
  },
  extraInfoText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  forecastSection: {
    margin: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  forecastContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  forecastCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    width: '31%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  forecastDay: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  forecastIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  forecastTemp: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  forecastCondition: {
    fontSize: 12,
    color: '#6B7280',
  },
  farmingTipsSection: {
    margin: 16,
    marginBottom: 32,
  },
  tipsContainer: {
    gap: 16,
  },
  tipCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 16,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22,
  },
}); 