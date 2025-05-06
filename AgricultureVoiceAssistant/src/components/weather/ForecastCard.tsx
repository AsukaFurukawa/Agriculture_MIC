import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Card } from '../Card';
import { Icon } from '../Icon';
import { colors } from '../../theme/colors';
import { getWeatherIcon } from '../../utils/weatherIcons';

interface ForecastCardProps {
  day: any;
  delay: number;
}

export const ForecastCard: React.FC<ForecastCardProps> = ({ day, delay }) => {
  const translateY = new Animated.Value(50);
  const opacity = new Animated.Value(0);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 500,
        delay,
        useNativeDriver: false,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        delay,
        useNativeDriver: false,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <Card variant="elevated" style={styles.card}>
        <Text style={styles.date}>
          {new Date(day.date).toLocaleDateString('hi-IN', { weekday: 'short' })}
        </Text>
        <Icon
          name={getWeatherIcon(day.day.condition.text)}
          size={32}
          color={colors.primary}
        />
        <View style={styles.tempContainer}>
          <Text style={styles.maxTemp}>{Math.round(day.day.maxtemp_c)}°</Text>
          <Text style={styles.minTemp}>{Math.round(day.day.mintemp_c)}°</Text>
        </View>
      </Card>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: 12,
  },
  card: {
    width: 100,
    alignItems: 'center',
    padding: 12,
  },
  date: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  tempContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 8,
  },
  maxTemp: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginRight: 4,
  },
  minTemp: {
    fontSize: 14,
    color: colors.text.secondary,
  },
}); 