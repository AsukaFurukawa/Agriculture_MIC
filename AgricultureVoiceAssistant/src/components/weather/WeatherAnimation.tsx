import React, { useEffect } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { Icon } from '../Icon';
import { colors } from '../../theme/colors';

interface WeatherAnimationProps {
  condition: string;
  size?: number;
}

export const WeatherAnimation: React.FC<WeatherAnimationProps> = ({ condition, size = 100 }) => {
  const rotateAnim = new Animated.Value(0);
  const bounceAnim = new Animated.Value(0);
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    const animations = {
      sun: Animated.loop(
        Animated.sequence([
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 10000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      ),
      rain: Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.bounce,
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
            toValue: 0,
            duration: 1000,
            easing: Easing.bounce,
            useNativeDriver: true,
          }),
        ])
      ),
      cloud: Animated.loop(
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 0.7,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ),
    };

    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes('sun')) {
      animations.sun.start();
    } else if (lowerCondition.includes('rain')) {
      animations.rain.start();
    } else if (lowerCondition.includes('cloud')) {
      animations.cloud.start();
    }

    return () => {
      Object.values(animations).forEach(anim => anim.stop());
    };
  }, [condition]);

  const getAnimation = () => {
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes('sun')) {
      return {
        transform: [
          {
            rotate: rotateAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0deg', '360deg'],
            }),
          },
        ],
      };
    } else if (lowerCondition.includes('rain')) {
      return {
        transform: [
          {
            translateY: bounceAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 10],
            }),
          },
        ],
      };
    } else if (lowerCondition.includes('cloud')) {
      return {
        opacity: fadeAnim,
      };
    }
    return {};
  };

  return (
    <Animated.View style={[styles.container, getAnimation()]}>
      <Icon
        name={getWeatherIcon(condition)}
        size={size}
        color={colors.primary}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 