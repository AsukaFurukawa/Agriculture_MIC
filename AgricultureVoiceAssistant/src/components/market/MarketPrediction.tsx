import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Card } from '../Card';
import { Icon } from '../Icon';
import { colors } from '../../theme/colors';

interface PricePrediction {
  date: string;
  price: number;
  confidence: number;
}

interface MarketPredictionProps {
  cropName: string;
  currentPrice: number;
  predictions: PricePrediction[];
  factors: {
    factor: string;
    impact: 'positive' | 'negative' | 'neutral';
    description: string;
  }[];
}

export const MarketPrediction: React.FC<MarketPredictionProps> = ({
  cropName,
  currentPrice,
  predictions,
  factors,
}) => {
  const screenWidth = Dimensions.get('window').width - 32;

  const chartConfig = {
    backgroundColor: colors.card,
    backgroundGradientFrom: colors.card,
    backgroundGradientTo: colors.card,
    decimalPlaces: 0,
    color: (opacity = 1) => colors.primary,
    labelColor: (opacity = 1) => colors.text.secondary,
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: colors.primary,
    },
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'positive':
        return { name: 'trending-up', color: colors.success };
      case 'negative':
        return { name: 'trending-down', color: colors.error };
      default:
        return { name: 'trending-neutral', color: colors.text.secondary };
    }
  };

  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <Icon name="chart-line" size={24} color={colors.primary} />
        <Text style={styles.title}>{cropName} मूल्य पूर्वानुमान</Text>
      </View>

      <View style={styles.priceContainer}>
        <Text style={styles.currentPrice}>₹{currentPrice}/क्विंटल</Text>
        <Text style={styles.priceLabel}>वर्तमान मूल्य</Text>
      </View>

      <LineChart
        data={{
          labels: predictions.map(p => p.date),
          datasets: [{
            data: predictions.map(p => p.price),
          }],
        }}
        width={screenWidth}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
      />

      <View style={styles.factorsContainer}>
        <Text style={styles.factorsTitle}>प्रभावित करने वाले कारण:</Text>
        {factors.map((factor, index) => {
          const icon = getImpactIcon(factor.impact);
          return (
            <View key={index} style={styles.factor}>
              <Icon name={icon.name} size={24} color={icon.color} />
              <View style={styles.factorContent}>
                <Text style={styles.factorName}>{factor.factor}</Text>
                <Text style={styles.factorDescription}>{factor.description}</Text>
              </View>
            </View>
          );
        })}
      </View>
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
  priceContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  currentPrice: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
  },
  priceLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 4,
  },
  chart: {
    marginVertical: 16,
    borderRadius: 16,
  },
  factorsContainer: {
    marginTop: 24,
  },
  factorsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 12,
  },
  factor: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 8,
  },
  factorContent: {
    marginLeft: 12,
    flex: 1,
  },
  factorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  factorDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 4,
  },
}); 