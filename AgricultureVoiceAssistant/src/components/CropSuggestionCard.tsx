import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../theme/colors';

export const CropSuggestionCard = ({ crop, onSelect }) => {
  return (
    <TouchableOpacity onPress={() => onSelect(crop)} style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.cropName}>{crop.name}</Text>
        <View style={[styles.profitIndicator, { backgroundColor: getProfitColor(crop.profitability) }]}>
          <Text style={styles.profitText}>₹{crop.expectedProfit}/एकड़</Text>
        </View>
      </View>
      
      <View style={styles.detailsContainer}>
        <DetailItem icon="water" label="पानी की आवश्यकता" value={crop.waterNeeds} />
        <DetailItem icon="calendar-range" label="अवधि" value={`${crop.duration} दिन`} />
        <DetailItem icon="sprout" label="मिट्टी का प्रकार" value={crop.soilType} />
      </View>

      <Text style={styles.suggestion}>{crop.suggestion}</Text>
    </TouchableOpacity>
  );
};

const DetailItem = ({ icon, label, value }) => (
  <View style={styles.detailItem}>
    <Icon name={icon} size={20} color={colors.primary} />
    <View>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    margin: 8,
    elevation: 3,
  },
  // ... other styles
}); 