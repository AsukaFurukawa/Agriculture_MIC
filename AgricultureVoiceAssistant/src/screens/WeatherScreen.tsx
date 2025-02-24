import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Header } from '../components/Header';
import { colors } from '../theme/colors';
import { weatherService } from '../services/weatherService';
import { useLocation } from '../contexts/LocationContext';

export const WeatherScreen = () => {
  const { location } = useLocation();
  const [weather, setWeather] = useState<any>(null);

  useEffect(() => {
    if (location) {
      fetchWeather();
    }
  }, [location]);

  const fetchWeather = async () => {
    if (!location) return;
    const data = await weatherService.getCurrentWeather(location.latitude, location.longitude);
    setWeather(data);
  };

  const getWeatherScript = () => {
    if (!weather) return '';
    return `आज का मौसम: तापमान ${weather.temperature} डिग्री सेल्सियस है। 
    वर्षा की संभावना ${weather.rainProbability}% है। 
    किसान सलाह: ${weather.advice}`;
  };

  return (
    <View style={styles.container}>
      <Header title="मौसम जानकारी" voiceText={getWeatherScript()} />
      <ScrollView style={styles.content}>
        {weather ? (
          <>
            <View style={styles.mainCard}>
              <Text style={styles.temperature}>{weather.temperature}°C</Text>
              <Text style={styles.condition}>{weather.condition}</Text>
              <View style={styles.weatherGrid}>
                <WeatherInfo 
                  icon="water-percent" 
                  value={`${weather.humidity}%`}
                  label="आद्रता"
                />
                <WeatherInfo 
                  icon="weather-rainy" 
                  value={`${weather.rainProbability}%`}
                  label="वर्षा संभावना"
                />
                <WeatherInfo 
                  icon="weather-windy" 
                  value={`${weather.windSpeed} km/h`}
                  label="हवा की गति"
                />
              </View>
            </View>

            <View style={styles.adviceCard}>
              <Text style={styles.adviceTitle}>किसान सलाह</Text>
              <Text style={styles.adviceText}>{weather.advice}</Text>
            </View>
          </>
        ) : (
          <View style={styles.loading}>
            <Text>मौसम की जानकारी लोड हो रही है...</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const WeatherInfo = ({ icon, value, label }: any) => (
  <View style={styles.infoItem}>
    <Icon name={icon} size={24} color={colors.primary} />
    <Text style={styles.infoValue}>{value}</Text>
    <Text style={styles.infoLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
  },
  mainCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    alignItems: 'center',
  },
  temperature: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.primary,
  },
  condition: {
    fontSize: 20,
    color: colors.text.secondary,
    marginTop: 8,
  },
  weatherGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  infoItem: {
    alignItems: 'center',
    padding: 10,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 4,
  },
  adviceCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    marginTop: 16,
    elevation: 2,
  },
  adviceTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 12,
  },
  adviceText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text.primary,
  },
  loading: {
    padding: 20,
    alignItems: 'center',
  },
}); 