import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useWebAppContext } from '../contexts/WebAppContext';
import { Icon } from '../../components/Icon';

export default function WeatherPage() {
  const { weatherData, language, locationName } = useWebAppContext();
  const [selectedDay, setSelectedDay] = useState(0);
  const [detailedView, setDetailedView] = useState(false);
  const [farmingAdvice, setFarmingAdvice] = useState([]);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;
  
  // Weather conditions mapped to icons and background colors
  const weatherIcons = {
    'Clear': { icon: 'weather-sunny', color: '#4299E1', gradient: ['#3B82F6', '#60A5FA'] },
    'Partly Cloudy': { icon: 'weather-partly-cloudy', color: '#9CA3AF', gradient: ['#6B7280', '#9CA3AF'] },
    'Cloudy': { icon: 'weather-cloudy', color: '#6B7280', gradient: ['#4B5563', '#6B7280'] },
    'Light Rain': { icon: 'weather-pouring', color: '#3B82F6', gradient: ['#1E40AF', '#3B82F6'] },
    'Rain': { icon: 'weather-pouring', color: '#2563EB', gradient: ['#1E40AF', '#3B82F6'] },
    'Thunderstorm': { icon: 'weather-lightning', color: '#6366F1', gradient: ['#4338CA', '#6366F1'] },
    'Snow': { icon: 'weather-snowy', color: '#93C5FD', gradient: ['#60A5FA', '#93C5FD'] },
    'Mist': { icon: 'weather-fog', color: '#9CA3AF', gradient: ['#6B7280', '#9CA3AF'] }
  };
  
  // Weekly forecast mock data
  const [extendedForecast, setExtendedForecast] = useState([
    { day: 'Today', temp: weatherData?.temperature || 25, tempMin: weatherData?.temperature - 3 || 22, tempMax: weatherData?.temperature + 2 || 28, condition: weatherData?.condition || 'Clear', humidity: weatherData?.humidity || 65, windSpeed: weatherData?.windSpeed || 12, precipitation: 0, sunrise: '06:15', sunset: '18:45' },
    { day: 'Tomorrow', temp: weatherData?.forecast[1]?.temp || 24, tempMin: (weatherData?.forecast[1]?.temp || 24) - 2, tempMax: (weatherData?.forecast[1]?.temp || 24) + 3, condition: weatherData?.forecast[1]?.condition || 'Partly Cloudy', humidity: 70, windSpeed: 10, precipitation: 20, sunrise: '06:16', sunset: '18:44' },
    { day: 'Day 3', temp: weatherData?.forecast[2]?.temp || 26, tempMin: 23, tempMax: 29, condition: 'Light Rain', humidity: 75, windSpeed: 15, precipitation: 40, sunrise: '06:17', sunset: '18:43' },
    { day: 'Day 4', temp: 28, tempMin: 24, tempMax: 31, condition: 'Clear', humidity: 60, windSpeed: 8, precipitation: 0, sunrise: '06:18', sunset: '18:42' },
    { day: 'Day 5', temp: 27, tempMin: 23, tempMax: 30, condition: 'Partly Cloudy', humidity: 65, windSpeed: 12, precipitation: 10, sunrise: '06:19', sunset: '18:41' },
    { day: 'Day 6', temp: 25, tempMin: 22, tempMax: 28, condition: 'Cloudy', humidity: 70, windSpeed: 14, precipitation: 30, sunrise: '06:20', sunset: '18:40' },
    { day: 'Day 7', temp: 26, tempMin: 23, tempMax: 29, condition: 'Clear', humidity: 60, windSpeed: 10, precipitation: 0, sunrise: '06:21', sunset: '18:39' }
  ]);
  
  // Hourly forecast mock data
  const [hourlyForecast, setHourlyForecast] = useState([
    { time: 'Now', temp: weatherData?.temperature || 25, condition: weatherData?.condition || 'Clear' },
    { time: '10 AM', temp: weatherData?.temperature + 1 || 26, condition: weatherData?.condition || 'Clear' },
    { time: '11 AM', temp: weatherData?.temperature + 2 || 27, condition: weatherData?.condition || 'Clear' },
    { time: '12 PM', temp: weatherData?.temperature + 3 || 28, condition: weatherData?.condition || 'Clear' },
    { time: '1 PM', temp: weatherData?.temperature + 2 || 27, condition: 'Partly Cloudy' },
    { time: '2 PM', temp: weatherData?.temperature + 1 || 26, condition: 'Partly Cloudy' },
    { time: '3 PM', temp: weatherData?.temperature || 25, condition: 'Partly Cloudy' },
    { time: '4 PM', temp: weatherData?.temperature - 1 || 24, condition: 'Partly Cloudy' },
    { time: '5 PM', temp: weatherData?.temperature - 1 || 24, condition: 'Cloudy' },
    { time: '6 PM', temp: weatherData?.temperature - 2 || 23, condition: 'Cloudy' }
  ]);
  
  // Farm advice based on weather conditions
  useEffect(() => {
    if (weatherData) {
      const condition = weatherData.condition;
      const temperature = weatherData.temperature;
      const humidity = weatherData.humidity;
      const advice = [];
      
      // Temperature-based advice
      if (temperature > 30) {
        advice.push({
          title: 'High Temperature Alert',
          description: 'Consider increasing irrigation frequency and applying mulch to retain soil moisture.',
          icon: 'thermometer-high'
        });
      } else if (temperature < 15) {
        advice.push({
          title: 'Low Temperature Alert',
          description: 'Protect sensitive crops with covers overnight to prevent frost damage.',
          icon: 'thermometer-low'
        });
      }
      
      // Condition-based advice
      if (condition === 'Clear') {
        advice.push({
          title: 'Ideal for Field Work',
          description: 'Good conditions for harvesting, spraying, or field operations.',
          icon: 'white-balance-sunny'
        });
      } else if (condition === 'Light Rain' || condition === 'Rain') {
        advice.push({
          title: 'Rainfall Alert',
          description: 'Delay spraying pesticides or fertilizers. Check drainage systems.',
          icon: 'weather-pouring'
        });
      } else if (condition === 'Partly Cloudy' || condition === 'Cloudy') {
        advice.push({
          title: 'Moderate Working Conditions',
          description: 'Good time for transplanting seedlings or light field work.',
          icon: 'weather-partly-cloudy'
        });
      }
      
      // Humidity-based advice
      if (humidity > 70) {
        advice.push({
          title: 'High Humidity Alert',
          description: 'Monitor crops for fungal diseases. Ensure proper ventilation in greenhouses.',
          icon: 'water-percent'
        });
      } else if (humidity < 40) {
        advice.push({
          title: 'Low Humidity Alert',
          description: 'Consider increasing irrigation. Watch for water stress in plants.',
          icon: 'water-off'
        });
      }
      
      setFarmingAdvice(advice);
    }
  }, [weatherData]);
  
  // Animation on mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);
  
  const getCurrentWeatherBackground = () => {
    if (!weatherData) return weatherIcons['Clear'].gradient;
    return weatherIcons[weatherData.condition]?.gradient || weatherIcons['Clear'].gradient;
  };
  
  const getWeatherIcon = (condition) => {
    return weatherIcons[condition]?.icon || 'weather-partly-cloudy';
  };
  
  const getDayName = (day) => {
    return day === 'Today' || day === 'Tomorrow' ? day : new Date(Date.now() + (extendedForecast.indexOf({ day }) * 24 * 60 * 60 * 1000)).toLocaleDateString('en-US', { weekday: 'short' });
  };
  
  // Translate UI text based on language
  const translate = (text) => {
    // In a real app, this would translate text based on the language setting
    // For now, we'll just return the English text
    return text;
  };
  
  // Generate detailed farming recommendations based on weather data
  const getDetailedFarmingRecommendations = () => {
    if (!weatherData) return [];
    
    const recommendations = [];
    const condition = weatherData.condition;
    const temperature = weatherData.temperature;
    
    // Crop protection recommendations
    if (condition === 'Light Rain' || condition === 'Rain') {
      recommendations.push({
        category: 'Crop Protection',
        title: 'Protect from Excess Moisture',
        description: 'Ensure proper drainage in fields to prevent waterlogging. Consider reinforcing any protective structures for sensitive crops.',
        icon: 'shield'
      });
    }
    
    // Irrigation recommendations
    if (condition === 'Clear' && temperature > 28) {
      recommendations.push({
        category: 'Irrigation',
        title: 'Increase Watering Frequency',
        description: 'Hot and clear conditions increase evaporation. Consider early morning or evening irrigation to minimize water loss.',
        icon: 'water'
      });
    } else if (condition === 'Clear' && temperature < 28) {
      recommendations.push({
        category: 'Irrigation',
        title: 'Moderate Watering',
        description: 'Maintain regular irrigation schedule. Check soil moisture before watering to prevent overwatering.',
        icon: 'water-outline'
      });
    }
    
    // Pest management
    if (weatherData.humidity > 70) {
      recommendations.push({
        category: 'Pest Management',
        title: 'Watch for Fungal Diseases',
        description: 'High humidity creates favorable conditions for fungal growth. Monitor crops closely and consider preventative treatments.',
        icon: 'bug'
      });
    }
    
    // Field operations
    if (condition === 'Clear' || condition === 'Partly Cloudy') {
      recommendations.push({
        category: 'Field Operations',
        title: 'Favorable Working Conditions',
        description: 'Good weather for harvesting, spraying, or other field operations. Consider making the most of these conditions.',
        icon: 'tractor'
      });
    } else {
      recommendations.push({
        category: 'Field Operations',
        title: 'Limited Field Work',
        description: 'Current conditions may limit certain field operations. Plan indoor tasks or maintenance work.',
        icon: 'tools'
      });
    }
    
    return recommendations;
  };
  
  if (!weatherData) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading weather data...</Text>
      </View>
    );
  }
  
  return (
    <ScrollView style={styles.container}>
      {/* Current Weather Section */}
      <Animated.View 
        style={[
          styles.currentWeatherContainer, 
          { 
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
            backgroundColor: weatherIcons[weatherData.condition]?.color || '#4299E1'
          }
        ]}
      >
        <View style={styles.locationContainer}>
          <Icon name="map-marker" size={24} color="white" />
          <Text style={styles.locationText}>{locationName || 'Your Location'}</Text>
        </View>
        
        <View style={styles.currentWeatherContent}>
          <View style={styles.mainWeatherInfo}>
            <Icon name={getWeatherIcon(weatherData.condition)} size={80} color="white" />
            <Text style={styles.temperatureText}>{weatherData.temperature}°C</Text>
            <Text style={styles.conditionText}>{weatherData.condition}</Text>
          </View>
          
          <View style={styles.weatherDetailsGrid}>
            <View style={styles.weatherDetailItem}>
              <Icon name="water-percent" size={24} color="white" />
              <Text style={styles.weatherDetailValue}>{weatherData.humidity}%</Text>
              <Text style={styles.weatherDetailLabel}>{translate('Humidity')}</Text>
            </View>
            
            <View style={styles.weatherDetailItem}>
              <Icon name="weather-windy" size={24} color="white" />
              <Text style={styles.weatherDetailValue}>{weatherData.windSpeed}</Text>
              <Text style={styles.weatherDetailLabel}>{translate('km/h')}</Text>
            </View>
            
            <View style={styles.weatherDetailItem}>
              <Icon name="weather-sunset-up" size={24} color="white" />
              <Text style={styles.weatherDetailValue}>{extendedForecast[0].sunrise}</Text>
              <Text style={styles.weatherDetailLabel}>{translate('Sunrise')}</Text>
            </View>
            
            <View style={styles.weatherDetailItem}>
              <Icon name="weather-sunset-down" size={24} color="white" />
              <Text style={styles.weatherDetailValue}>{extendedForecast[0].sunset}</Text>
              <Text style={styles.weatherDetailLabel}>{translate('Sunset')}</Text>
            </View>
          </View>
        </View>
      </Animated.View>
      
      {/* Hourly Forecast */}
      <Animated.View 
        style={[
          styles.forecastContainer, 
          { 
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <Text style={styles.sectionTitle}>{translate('Today\'s Forecast')}</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.hourlyScrollView}
        >
          {hourlyForecast.map((hour, index) => (
            <View key={index} style={styles.hourlyItem}>
              <Text style={styles.hourlyTime}>{hour.time}</Text>
              <Icon name={getWeatherIcon(hour.condition)} size={24} color="#4B5563" />
              <Text style={styles.hourlyTemp}>{hour.temp}°</Text>
            </View>
          ))}
        </ScrollView>
      </Animated.View>
      
      {/* 7-Day Forecast */}
      <Animated.View 
        style={[
          styles.forecastContainer, 
          { 
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <Text style={styles.sectionTitle}>{translate('7-Day Forecast')}</Text>
        
        {extendedForecast.map((day, index) => (
          <TouchableOpacity 
            key={index}
            style={[
              styles.dailyForecastItem,
              selectedDay === index && styles.selectedDayItem
            ]}
            onPress={() => {
              setSelectedDay(index);
              setDetailedView(true);
            }}
          >
            <View style={styles.dailyMainInfo}>
              <Text style={styles.dayName}>{getDayName(day.day)}</Text>
              <View style={styles.dailyCondition}>
                <Icon name={getWeatherIcon(day.condition)} size={24} color="#4B5563" />
                <Text style={styles.conditionSmallText}>{day.condition}</Text>
              </View>
              <Text style={styles.dailyTemp}>{day.tempMin}° / {day.tempMax}°</Text>
            </View>
            
            {selectedDay === index && detailedView && (
              <View style={styles.detailedDayView}>
                <View style={styles.detailedDayGrid}>
                  <View style={styles.detailedDayItem}>
                    <Icon name="water-percent" size={20} color="#4B5563" />
                    <Text style={styles.detailedDayLabel}>{translate('Humidity')}</Text>
                    <Text style={styles.detailedDayValue}>{day.humidity}%</Text>
                  </View>
                  
                  <View style={styles.detailedDayItem}>
                    <Icon name="weather-windy" size={20} color="#4B5563" />
                    <Text style={styles.detailedDayLabel}>{translate('Wind')}</Text>
                    <Text style={styles.detailedDayValue}>{day.windSpeed} km/h</Text>
                  </View>
                  
                  <View style={styles.detailedDayItem}>
                    <Icon name="water" size={20} color="#4B5563" />
                    <Text style={styles.detailedDayLabel}>{translate('Precip')}</Text>
                    <Text style={styles.detailedDayValue}>{day.precipitation}%</Text>
                  </View>
                  
                  <View style={styles.detailedDayItem}>
                    <Icon name="thermometer" size={20} color="#4B5563" />
                    <Text style={styles.detailedDayLabel}>{translate('Feels Like')}</Text>
                    <Text style={styles.detailedDayValue}>{day.temp}°</Text>
                  </View>
                </View>
                
                <TouchableOpacity 
                  style={styles.closeDetailedViewButton}
                  onPress={() => setDetailedView(false)}
                >
                  <Icon name="chevron-up" size={20} color="#4B5563" />
                  <Text style={styles.closeDetailedViewText}>{translate('Close')}</Text>
                </TouchableOpacity>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </Animated.View>
      
      {/* Farming Recommendations */}
      <Animated.View 
        style={[
          styles.forecastContainer, 
          styles.adviceContainer,
          { 
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <Text style={styles.sectionTitle}>{translate('Farming Recommendations')}</Text>
        
        {farmingAdvice.map((advice, index) => (
          <View key={index} style={styles.adviceItem}>
            <View style={styles.adviceIconContainer}>
              <Icon name={advice.icon} size={32} color="#10B981" />
            </View>
            <View style={styles.adviceContent}>
              <Text style={styles.adviceTitle}>{advice.title}</Text>
              <Text style={styles.adviceDescription}>{advice.description}</Text>
            </View>
          </View>
        ))}
        
        {/* Detailed Recommendations */}
        {getDetailedFarmingRecommendations().map((rec, index) => (
          <View key={`detailed-${index}`} style={styles.detailedAdviceItem}>
            <View style={styles.adviceHeader}>
              <View style={[styles.categoryTag, { backgroundColor: getCategoryColor(rec.category) }]}>
                <Text style={styles.categoryText}>{rec.category}</Text>
              </View>
              <Icon name={rec.icon} size={24} color={getCategoryColor(rec.category)} />
            </View>
            <Text style={styles.detailedAdviceTitle}>{rec.title}</Text>
            <Text style={styles.detailedAdviceDescription}>{rec.description}</Text>
          </View>
        ))}
      </Animated.View>
    </ScrollView>
  );
}

function getCategoryColor(category) {
  const colorMap = {
    'Crop Protection': '#3B82F6', // blue
    'Irrigation': '#60A5FA', // lighter blue
    'Pest Management': '#EF4444', // red
    'Field Operations': '#F59E0B', // amber
    'Harvesting': '#10B981', // emerald
    'Planting': '#8B5CF6', // purple
  };
  
  return colorMap[category] || '#6B7280'; // gray as default
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  loadingText: {
    fontSize: 18,
    color: '#4B5563',
  },
  currentWeatherContainer: {
    padding: 24,
    borderRadius: 0,
    marginBottom: 16,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  locationText: {
    fontSize: 18,
    fontWeight: '500',
    color: 'white',
    marginLeft: 8,
  },
  currentWeatherContent: {
    alignItems: 'center',
  },
  mainWeatherInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  temperatureText: {
    fontSize: 64,
    fontWeight: 'bold',
    color: 'white',
    marginVertical: 8,
  },
  conditionText: {
    fontSize: 24,
    color: 'white',
    opacity: 0.9,
  },
  weatherDetailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 16,
  },
  weatherDetailItem: {
    alignItems: 'center',
    flex: 1,
  },
  weatherDetailValue: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginTop: 4,
  },
  weatherDetailLabel: {
    fontSize: 14,
    color: 'white',
    opacity: 0.8,
  },
  forecastContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  hourlyScrollView: {
    marginBottom: 8,
  },
  hourlyItem: {
    alignItems: 'center',
    marginRight: 24,
    minWidth: 60,
  },
  hourlyTime: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 8,
  },
  hourlyTemp: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 8,
  },
  dailyForecastItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 12,
  },
  selectedDayItem: {
    backgroundColor: '#F3F4F6',
    marginHorizontal: -16,
    paddingHorizontal: 16,
    borderRadius: 0,
    borderBottomWidth: 0,
  },
  dailyMainInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dayName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    width: 100,
  },
  dailyCondition: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 8,
  },
  conditionSmallText: {
    fontSize: 14,
    color: '#4B5563',
    marginLeft: 8,
  },
  dailyTemp: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    textAlign: 'right',
    width: 80,
  },
  detailedDayView: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  detailedDayGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  detailedDayItem: {
    width: '50%',
    paddingVertical: 8,
    paddingHorizontal: 4,
    alignItems: 'flex-start',
  },
  detailedDayLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  detailedDayValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 2,
  },
  closeDetailedViewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  closeDetailedViewText: {
    fontSize: 14,
    color: '#4B5563',
    marginLeft: 4,
  },
  adviceContainer: {
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  adviceItem: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#ECFDF5',
    borderRadius: 8,
    padding: 12,
  },
  adviceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  adviceContent: {
    flex: 1,
  },
  adviceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  adviceDescription: {
    fontSize: 14,
    color: '#4B5563',
  },
  detailedAdviceItem: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  adviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    backgroundColor: '#3B82F6',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
    color: 'white',
  },
  detailedAdviceTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  detailedAdviceDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: '#4B5563',
  },
}); 