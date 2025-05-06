import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../Card';
import { Icon } from '../Icon';
import { colors } from '../../theme/colors';
import { getWeatherIcon } from '../../utils/weatherIcons';

interface WeatherCardProps {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  location: string;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({
  temperature,
  condition,
  humidity,
  windSpeed,
  location,
}) => {
  return (
    <Card variant="elevated" style={styles.container}>
      <View style={styles.header}>
        <Icon name="map-marker" size={24} color={colors.primary} />
        <Text style={styles.location}>{location}</Text>
      </View>

      <View style={styles.mainContent}>
        <View style={styles.temperatureContainer}>
          <Text style={styles.temperature}>{Math.round(temperature)}°</Text>
          <Text style={styles.condition}>{condition}</Text>
        </View>
        <Icon
          name={getWeatherIcon(condition)}
          size={64}
          color={colors.primary}
        />
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <Icon name="water-percent" size={24} color={colors.primary} />
          <Text style={styles.detailValue}>{humidity}%</Text>
          <Text style={styles.detailLabel}>नमी</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.detailItem}>
          <Icon name="weather-windy" size={24} color={colors.primary} />
          <Text style={styles.detailValue}>{windSpeed} km/h</Text>
          <Text style={styles.detailLabel}>हवा</Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  location: {
    fontSize: 18,
    color: colors.text.primary,
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
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  condition: {
    fontSize: 20,
    color: colors.text.secondary,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginTop: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 4,
  },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: colors.border,
  },
}); 