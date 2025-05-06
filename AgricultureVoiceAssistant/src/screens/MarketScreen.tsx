import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, ActivityIndicator } from 'react-native';
import { useLocation } from '../contexts/LocationContext';
import { colors } from '../theme/colors';
import { Icon } from '../components/Icon';
import { marketService } from '../services/marketService';
import { useRoute } from '@react-navigation/native';

interface MarketPrice {
  crop: string;
  price: number;
  trend: 'up' | 'down' | 'stable';
  market: string;
  lastUpdated: string;
}

export const MarketScreen = () => {
  const { location } = useLocation();
  const route = useRoute();
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCrop, setSelectedCrop] = useState<string | null>(
    route.params?.crop || null
  );
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    if (location?.state && location?.district) {
      fetchPrices(selectedCrop);
    }
  }, [location, selectedCrop]);

  const fetchPrices = async (crop?: string | null) => {
    try {
      setLoading(true);
      const data = await marketService.getCurrentPrices(
        location?.state || '', 
        location?.district || '',
        crop
      );
      setPrices(data);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    } catch (error) {
      console.error('Error fetching prices:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return { name: 'trending-up', color: colors.success };
      case 'down':
        return { name: 'trending-down', color: colors.error };
      default:
        return { name: 'trending-neutral', color: colors.text.secondary };
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>बाज़ार भाव</Text>
        <Text style={styles.location}>{location?.district}, {location?.state}</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={() => fetchPrices(selectedCrop)}>
          <Icon name="refresh" size={24} color={colors.text.light} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>बाज़ार भाव प्राप्त कर रहे हैं...</Text>
        </View>
      ) : prices.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="store-off" size={48} color={colors.text.secondary} />
          <Text style={styles.emptyText}>कोई बाज़ार भाव उपलब्ध नहीं है</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => fetchPrices(selectedCrop)}>
            <Text style={styles.retryText}>पुनः प्रयास करें</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={styles.content}>
          {prices.map((item, index) => (
            <Animated.View 
              key={index}
              style={[
                styles.priceCard,
                { opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0]
                })}] }
              ]}
            >
              <View style={styles.cropInfo}>
                <Text style={styles.cropName}>{item.crop}</Text>
                <View style={styles.priceContainer}>
                  <Text style={styles.price}>₹{item.price}/क्विंटल</Text>
                  <Icon 
                    name={getTrendIcon(item.trend).name}
                    size={24}
                    color={getTrendIcon(item.trend).color}
                  />
                </View>
              </View>
              <View style={styles.marketInfo}>
                <Text style={styles.marketName}>{item.market}</Text>
                <Text style={styles.updateTime}>अपडेट: {item.lastUpdated}</Text>
              </View>
            </Animated.View>
          ))}
        </ScrollView>
      )}

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <Icon name="trending-up" size={16} color={colors.success} />
          <Text style={styles.legendText}>बढ़त</Text>
        </View>
        <View style={styles.legendItem}>
          <Icon name="trending-down" size={16} color={colors.error} />
          <Text style={styles.legendText}>गिरावट</Text>
        </View>
        <View style={styles.legendItem}>
          <Icon name="trending-neutral" size={16} color={colors.text.secondary} />
          <Text style={styles.legendText}>स्थिर</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    padding: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.light,
    marginBottom: 8,
  },
  location: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  refreshButton: {
    position: 'absolute',
    right: 20,
    top: 20,
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  priceCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  cropInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cropName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginRight: 8,
  },
  marketInfo: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
    marginTop: 8,
  },
  marketName: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  updateTime: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 4,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendText: {
    marginLeft: 4,
    color: colors.text.secondary,
    fontSize: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.secondary,
  },
  retryButton: {
    padding: 16,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  retryText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.light,
  },
}); 