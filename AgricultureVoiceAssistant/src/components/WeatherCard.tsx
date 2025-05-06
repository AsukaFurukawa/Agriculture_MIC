import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../theme/colors';

export const WeatherCard = ({ weather }) => {
  return (
    <View style={styles.card}>
      <Icon name={getWeatherIcon(weather.condition)} size={40} color={colors.primary} />
      <Text style={styles.temperature}>{weather.temperature}°C</Text>
      <Text style={styles.condition}>{weather.condition}</Text>
      <Text style={styles.advice}>{getWeatherAdvice(weather)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    margin: 8,
    elevation: 3,
    alignItems: 'center',
  },
  temperature: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  condition: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  advice: {
    marginTop: 8,
    textAlign: 'center',
    color: colors.text.primary,
  },
}); 