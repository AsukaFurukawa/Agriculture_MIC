import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export const YearlyPlanCard = ({ plan }) => (
  <View style={styles.container}>
    <Text style={styles.title}>वार्षिक खेती योजना</Text>
    
    {plan.map((season, index) => (
      <View key={index} style={styles.seasonCard}>
        <Text style={styles.seasonTitle}>{season.season}</Text>
        
        <View style={styles.cropInfo}>
          <Icon name="sprout" size={24} color={colors.primary} />
          <Text style={styles.primaryCrop}>{season.primaryCrop}</Text>
        </View>

        <View style={styles.companionSection}>
          <Text style={styles.subtitle}>साथ में उगाएं:</Text>
          {season.companionCrops.map((crop, idx) => (
            <Text key={idx} style={styles.companionCrop}>• {crop}</Text>
          ))}
        </View>

        <View style={styles.benefitsSection}>
          <Text style={styles.subtitle}>फायदे:</Text>
          {season.soilBenefits.map((benefit, idx) => (
            <Text key={idx} style={styles.benefit}>• {benefit}</Text>
          ))}
        </View>

        <View style={styles.nextSeason}>
          <Icon name="arrow-right" size={20} color={colors.secondary} />
          <Text style={styles.nextCrop}>
            अगली फसल: {season.nextSeasonSuggestion}
          </Text>
        </View>
      </View>
    ))}
  </View>
); 