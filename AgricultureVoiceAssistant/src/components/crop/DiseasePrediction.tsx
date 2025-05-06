import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Card } from '../Card';
import { Icon } from '../Icon';
import { colors } from '../../theme/colors';

interface DiseasePredictionProps {
  weatherCondition: string;
  risks: {
    disease: string;
    probability: number;
    symptoms: string[];
    prevention: string[];
  }[];
}

export const DiseasePrediction: React.FC<DiseasePredictionProps> = ({
  weatherCondition,
  risks,
}) => {
  const getRiskColor = (probability: number) => {
    if (probability > 70) return colors.error;
    if (probability > 30) return colors.warning;
    return colors.success;
  };

  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <Icon name="bug" size={24} color={colors.primary} />
        <Text style={styles.title}>रोग चेतावनी</Text>
      </View>

      <Text style={styles.weatherInfo}>
        मौसम स्थिति: {weatherCondition}
      </Text>

      {risks.map((risk, index) => (
        <View key={index} style={styles.riskCard}>
          <View style={styles.riskHeader}>
            <Text style={styles.diseaseName}>{risk.disease}</Text>
            <View style={[styles.probabilityBadge, { backgroundColor: getRiskColor(risk.probability) }]}>
              <Text style={styles.probabilityText}>{risk.probability}% जोखिम</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>लक्षण:</Text>
            {risk.symptoms.map((symptom, idx) => (
              <View key={idx} style={styles.bulletPoint}>
                <Icon name="circle-small" size={20} color={colors.primary} />
                <Text style={styles.bulletText}>{symptom}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>बचाव:</Text>
            {risk.prevention.map((prevention, idx) => (
              <View key={idx} style={styles.bulletPoint}>
                <Icon name="shield-check" size={20} color={colors.success} />
                <Text style={styles.bulletText}>{prevention}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginLeft: 8,
  },
  weatherInfo: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: 16,
  },
  riskCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  riskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  diseaseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  probabilityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  probabilityText: {
    color: colors.text.light,
    fontSize: 14,
    fontWeight: 'bold',
  },
  section: {
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
  },
  bulletPoint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  bulletText: {
    fontSize: 14,
    color: colors.text.secondary,
    marginLeft: 8,
    flex: 1,
  },
}); 