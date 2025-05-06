import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppNavigator } from './AppNavigator';
import { FloatingMic } from '../components/FloatingMic';
import { colors } from '../theme/colors';

export const NavigationWrapper = () => {
  console.log('NavigationWrapper rendering'); // Debug log
  return (
    <View style={styles.container}>
      <AppNavigator />
      <FloatingMic />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.vintage.parchment,
  },
}); 