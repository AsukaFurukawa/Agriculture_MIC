import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocation } from '../contexts/LocationContext';
import { useLanguage } from '../contexts/LanguageContext';
import { llmService } from '../services/llmService';
import { colors } from '../theme/colors';
import { Icon } from '../components/Icon';

export const CropAdviceScreen = () => {
  const { location } = useLocation();
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState<any>(null);

  const getCropAdvice = async () => {
    setLoading(true);
    try {
      const response = await llmService.getCropAdvice(
        `What crops should I grow in ${location?.district}, ${location?.state}?`,
        language
      );
      setAdvice(response);
    } catch (error) {
      console.error('Error getting crop advice:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>फसल सलाह</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={getCropAdvice}>
          <Icon name="refresh" size={24} color={colors.text.light} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>AI से सलाह प्राप्त कर रहे हैं...</Text>
        </View>
      ) : advice ? (
        <View style={styles.adviceContainer}>
          <View style={styles.recommendedCrops}>
            <Text style={styles.sectionTitle}>अनुशंसित फसलें</Text>
            {advice.crops.map((crop: any, index: number) => (
              <View key={index} style={styles.cropCard}>
                <Icon name="sprout" size={24} color={colors.primary} />
                <View style={styles.cropInfo}>
                  <Text style={styles.cropName}>{crop.name}</Text>
                  <Text style={styles.cropDetails}>{crop.details}</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.seasonalAdvice}>
            <Text style={styles.sectionTitle}>मौसमी सलाह</Text>
            <Text style={styles.adviceText}>{advice.seasonalAdvice}</Text>
          </View>

          <View style={styles.marketInsights}>
            <Text style={styles.sectionTitle}>बाजार जानकारी</Text>
            <Text style={styles.adviceText}>{advice.marketInsights}</Text>
          </View>
        </View>
      ) : (
        <TouchableOpacity style={styles.getAdviceButton} onPress={getCropAdvice}>
          <Text style={styles.getAdviceText}>AI से सलाह लें</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.primary,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.light,
  },
  refreshButton: {
    padding: 8,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: colors.text.secondary,
  },
  adviceContainer: {
    padding: 16,
  },
  recommendedCrops: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 10,
  },
  cropCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  cropInfo: {
    marginLeft: 12,
    flex: 1,
  },
  cropName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  cropDetails: {
    marginTop: 4,
    color: colors.text.secondary,
  },
  seasonalAdvice: {
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  marketInsights: {
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 8,
  },
  adviceText: {
    color: colors.text.secondary,
    lineHeight: 20,
  },
  getAdviceButton: {
    backgroundColor: colors.primary,
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  getAdviceText: {
    color: colors.text.light,
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 