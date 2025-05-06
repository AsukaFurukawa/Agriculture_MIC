import React from 'react';
import { StyleSheet, ViewProps } from 'react-native';
import LinearGradient from 'react-native-web-linear-gradient';
import { colors } from '../theme/colors';

interface GradientBackgroundProps extends ViewProps {
  variant?: 'primary' | 'secondary';
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({
  children,
  style,
  variant = 'primary',
  ...props
}) => {
  const gradientColors = variant === 'primary' 
    ? [colors.primaryLight, colors.background]
    : [colors.secondaryLight, colors.background];

  return (
    <LinearGradient
      colors={gradientColors}
      style={[styles.container, style]}
      {...props}
    >
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
}); 