import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Header } from '../components/Header';
import { colors } from '../theme/colors';
import { marketService } from '../services/marketService';
import { CROP_TYPES } from '../config/env';

interface MarketPrice {
  crop: string;
  price: number;
  trend: 'up' | 'down' | 'stable';
  market: string;
  advice: string;
  confidence: 'high' | 'medium' | 'low';
  factors: string[];
  updated: string;
}

export const MarketScreen = () => {
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [selectedCrop, setSelectedCrop] = useState<string>(CROP_TYPES.WHEAT);

  useEffect(() => {
    fetchPrices();
  }, [selectedCrop]);

  const fetchPrices = async () => {
    const data = await marketService.getCurrentPrices('UP', 'Lucknow');
    setPrices(data);
  };

  const getMarketScript = () => {
    if (!prices.length) return '';
    const price = prices[0];
    return `${price.crop} का वर्तमान भाव ${price.price} रुपये प्रति क्विंटल है।`;
  };

  return (
    <View style={styles.container}>
      <Header title="बाज़ार भाव" voiceText={getMarketScript()} />
      
      <ScrollView style={styles.content}>
        <View style={styles.cropSelector}>
          {Object.entries(CROP_TYPES).map(([key, value]) => (
            <TouchableOpacity
              key={key}
              style={[
                styles.cropButton,
                selectedCrop === value && styles.selectedCrop
              ]}
              onPress={() => setSelectedCrop(value)}
            >
              <Text style={[
                styles.cropButtonText,
                selectedCrop === value && styles.selectedCropText
              ]}>
                {value}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {prices.map((price, index) => (
          <View key={index} style={styles.priceCard}>
            <View style={styles.priceHeader}>
              <Text style={styles.cropName}>{price.crop}</Text>
              <View style={styles.confidenceTag}>
                <Text style={styles.confidenceText}>
                  {price.confidence === 'high' ? 'उच्च विश्वसनीयता' : 
                   price.confidence === 'medium' ? 'मध्यम विश्वसनीयता' : 
                   'अनुमानित'}
                </Text>
              </View>
            </View>

            <View style={styles.priceDetails}>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>मूल्य:</Text>
                <Text style={styles.priceValue}>₹{price.price}/क्विंटल</Text>
              </View>
              
              <View style={styles.adviceSection}>
                <Text style={styles.adviceLabel}>व्यापार सलाह:</Text>
                <Text style={styles.adviceText}>{price.advice}</Text>
              </View>

              <View style={styles.factorsSection}>
                <Text style={styles.factorsLabel}>प्रभावित करने वाले कारण:</Text>
                {price.factors.map((factor, idx) => (
                  <Text key={idx} style={styles.factor}>• {factor}</Text>
                ))}
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
  },
  cropSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 8,
  },
  cropButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedCrop: {
    backgroundColor: colors.primary,
  },
  cropButtonText: {
    color: colors.text.primary,
  },
  selectedCropText: {
    color: colors.text.light,
  },
  priceCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  priceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cropName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  confidenceTag: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  confidenceText: {
    fontSize: 12,
    color: colors.primary,
  },
  priceDetails: {
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  priceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  adviceSection: {
    marginTop: 12,
    padding: 8,
    backgroundColor: colors.background + '80',
    borderRadius: 8,
  },
  adviceLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  adviceText: {
    fontSize: 14,
    color: colors.text.primary,
    lineHeight: 20,
  },
  factorsSection: {
    marginTop: 12,
  },
  factorsLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  factor: {
    fontSize: 14,
    color: colors.text.primary,
    marginLeft: 8,
    marginTop: 2,
  },
}); 