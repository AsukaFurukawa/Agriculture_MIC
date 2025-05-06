import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Icon } from '../Icon';
import { colors } from '../../theme/colors';

interface DetailItemProps {
  icon: string;
  value: string;
  label: string;
}

export const DetailItem: React.FC<DetailItemProps> = ({ icon, value, label }) => {
  return (
    <View style={styles.container}>
      <Icon name={icon} size={24} color={colors.primary} />
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 8,
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginTop: 4,
  },
  label: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2,
  },
}); 