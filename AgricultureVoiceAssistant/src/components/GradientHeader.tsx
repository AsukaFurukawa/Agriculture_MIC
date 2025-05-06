import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-web-linear-gradient';
import { colors } from '../theme/colors';


interface GradientHeaderProps {
  title: string;
  subtitle?: string;
}

export const GradientHeader: React.FC<GradientHeaderProps> = ({ title, subtitle }) => {
  return (
    <LinearGradient
      colors={[colors.vintage.darkBrown, colors.vintage.parchment]}
      style={styles.container}
    >
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 32,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.vintage.paper,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.vintage.gold,
    textAlign: 'center',
    marginTop: 8,
  },
}); 