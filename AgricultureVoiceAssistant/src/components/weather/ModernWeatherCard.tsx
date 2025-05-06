import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'react-native-web-linear-gradient';
import { Icon } from '../Icon';
import { colors } from '../../theme/colors';
import { WeatherAnimation } from './WeatherAnimation';

interface ModernWeatherCardProps {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  location: string;
}

const { width } = Dimensions.get('window');

export const ModernWeatherCard: React.FC<ModernWeatherCardProps> = ({
  temperature,
  condition,
  humidity,
  windSpeed,
  location,
}) => {
  return (
    <LinearGradient
      colors={[colors.primary, colors.primaryDark]}
      style={styles.container}
    >
      <View style={styles.locationContainer}>
        <Icon name="map-marker" size={24} color={colors.text.light} />
        <Text style={styles.location}>{location}</Text>
      </View>

      <View style={styles.mainContent}>
        <View style={styles.temperatureContainer}>
          <Text style={styles.temperature}>{Math.round(temperature)}°</Text>
          <Text style={styles.condition}>{condition}</Text>
        </View>

        <WeatherAnimation condition={condition} size={120} />
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <Icon name="water-percent" size={24} color={colors.text.light} />
          <Text style={styles.detailValue}>{humidity}%</Text>
          <Text style={styles.detailLabel}>नमी</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.detailItem}>
          <Icon name="weather-windy" size={24} color={colors.text.light} />
          <Text style={styles.detailValue}>{windSpeed} km/h</Text>
          <Text style={styles.detailLabel}>हवा</Text>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width - 32,
    borderRadius: 24,
    padding: 24,
    marginVertical: 16,
    elevation: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  location: {
    fontSize: 18,
    color: colors.text.light,
    marginLeft: 8,
  },
  mainContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  temperatureContainer: {
    flex: 1,
  },
  temperature: {
    fontSize: 72,
    fontWeight: 'bold',
    color: colors.text.light,
  },
  condition: {
    fontSize: 24,
    color: colors.text.light,
    opacity: 0.8,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 16,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.light,
    marginTop: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: colors.text.light,
    opacity: 0.8,
    marginTop: 4,
  },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: colors.text.light,
    opacity: 0.2,
  },
}); 