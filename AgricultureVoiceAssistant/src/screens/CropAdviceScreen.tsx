import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Header } from '../components/Header';
import { colors } from '../theme/colors';
import { CROP_TYPES } from '../config/env';

interface CropAdvice {
  crop: string;
  season: string;
  soilType: string;
  waterRequirement: string;
  expectedYield: string;
  tips: string[];
}

export const CropAdviceScreen = () => {
  const [selectedCrop, setSelectedCrop] = useState<string>(CROP_TYPES.WHEAT);
  const [advice, setAdvice] = useState<CropAdvice>({
    crop: 'गेहूं',
    season: 'रबी',
    soilType: 'दोमट मिट्टी',
    waterRequirement: 'मध्यम',
    expectedYield: '45-50 क्विंटल/हेक्टेयर',
    tips: [
      'बुवाई का सही समय अक्टूबर-नवंबर है',
      'प्रति हेक्टेयर 100 किलो बीज की आवश्यकता होती है',
      'पहली सिंचाई 21 दिन बाद करें',
    ],
  });

  const getAdviceScript = () => {
    return `${advice.crop} की खेती के लिए सलाह: ${advice.tips[0]}`;
  };

  return (
    <View style={styles.container}>
      <Header title="फसल सलाह" voiceText={getAdviceScript()} />
      
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

        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Icon name="sprout" size={24} color={colors.primary} />
            <Text style={styles.cropName}>{advice.crop}</Text>
          </View>

          <View style={styles.infoGrid}>
            <InfoItem label="मौसम" value={advice.season} />
            <InfoItem label="मिट्टी" value={advice.soilType} />
            <InfoItem label="पानी" value={advice.waterRequirement} />
            <InfoItem label="उपज" value={advice.expectedYield} />
          </View>

          <View style={styles.tipsSection}>
            <Text style={styles.tipsHeader}>महत्वपूर्ण सलाह</Text>
            {advice.tips.map((tip, index) => (
              <View key={index} style={styles.tipItem}>
                <Icon name="check-circle" size={20} color={colors.success} />
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.infoItem}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

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
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cropName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 12,
    color: colors.text.primary,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  infoItem: {
    width: '50%',
    padding: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginTop: 4,
  },
  tipsSection: {
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 8,
  },
  tipsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: colors.primary,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipText: {
    marginLeft: 12,
    fontSize: 16,
    color: colors.text.primary,
    flex: 1,
  },
}); 