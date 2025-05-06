import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useWebAppContext } from '../contexts/WebAppContext';

export default function MarketPage() {
  const { marketData, locationName } = useWebAppContext();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('prices');
  
  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading || !marketData) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading market data...</Text>
      </View>
    );
  }
  
  const getTrendIcon = (trend) => {
    switch(trend.toLowerCase()) {
      case 'up':
        return '↗️';
      case 'down':
        return '↘️';
      case 'stable':
      default:
        return '→';
    }
  };
  
  const getTrendColor = (trend) => {
    switch(trend.toLowerCase()) {
      case 'up':
        return '#10B981'; // green
      case 'down':
        return '#EF4444'; // red
      case 'stable':
      default:
        return '#6B7280'; // gray
    }
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Market Dashboard</Text>
        <Text style={styles.headerSubtitle}>{locationName}</Text>
      </View>
      
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, selectedTab === 'prices' && styles.activeTab]} 
          onPress={() => setSelectedTab('prices')}
        >
          <Text style={[styles.tabText, selectedTab === 'prices' && styles.activeTabText]}>
            Crop Prices
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, selectedTab === 'markets' && styles.activeTab]} 
          onPress={() => setSelectedTab('markets')}
        >
          <Text style={[styles.tabText, selectedTab === 'markets' && styles.activeTabText]}>
            Nearby Markets
          </Text>
        </TouchableOpacity>
      </View>
      
      {selectedTab === 'prices' ? (
        <View style={styles.pricesContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Crop</Text>
            <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Price (₹/qt)</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Trend</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Change</Text>
          </View>
          
          {marketData.crops.map((crop, index) => (
            <View key={index} style={[styles.tableRow, index % 2 === 0 ? styles.evenRow : null]}>
              <Text style={[styles.tableCell, { flex: 2, fontWeight: 'bold' }]}>{crop.name}</Text>
              <Text style={[styles.tableCell, { flex: 2 }]}>₹{crop.price}</Text>
              <Text style={[styles.tableCell, { flex: 1, color: getTrendColor(crop.trend) }]}>
                {getTrendIcon(crop.trend)}
              </Text>
              <Text style={[styles.tableCell, { flex: 1, color: getTrendColor(crop.trend) }]}>
                {crop.change}
              </Text>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.marketsContainer}>
          {marketData.nearbyMarkets.map((market, index) => (
            <View key={index} style={styles.marketCard}>
              <View style={styles.marketCardHeader}>
                <Text style={styles.marketName}>{market.name}</Text>
                <View style={styles.distanceBadge}>
                  <Text style={styles.distanceText}>{market.distance}</Text>
                </View>
              </View>
              
              <View style={styles.marketDetails}>
                <View style={styles.marketDetail}>
                  <Text style={styles.marketDetailLabel}>Trading Hours</Text>
                  <Text style={styles.marketDetailValue}>6:00 AM - 2:00 PM</Text>
                </View>
                <View style={styles.marketDetail}>
                  <Text style={styles.marketDetailLabel}>Trading Days</Text>
                  <Text style={styles.marketDetailValue}>Monday - Saturday</Text>
                </View>
                <View style={styles.marketDetail}>
                  <Text style={styles.marketDetailLabel}>Contact</Text>
                  <Text style={styles.marketDetailValue}>+91 98765 43210</Text>
                </View>
              </View>
              
              <TouchableOpacity style={styles.directionButton}>
                <Text style={styles.directionButtonText}>Get Directions</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
      
      <View style={styles.marketTipsSection}>
        <Text style={styles.sectionTitle}>Market Tips</Text>
        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>Best Selling Time</Text>
          <Text style={styles.tipText}>
            Prices for {marketData.crops[0].name} are trending {marketData.crops[0].trend}. 
            {marketData.crops[0].trend.toLowerCase() === 'up' 
              ? ' Consider selling soon to get the best rates.' 
              : marketData.crops[0].trend.toLowerCase() === 'down' 
                ? ' Consider waiting if possible as prices might improve.' 
                : ' Prices are stable. Good time to sell if you need immediate returns.'}
          </Text>
        </View>
        
        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>Market Insights</Text>
          <Text style={styles.tipText}>
            The most profitable crops this season based on current trends are 
            {marketData.crops
              .sort((a, b) => {
                const aValue = a.trend === 'up' ? 3 : a.trend === 'stable' ? 2 : 1;
                const bValue = b.trend === 'up' ? 3 : b.trend === 'stable' ? 2 : 1;
                return bValue - aValue;
              })
              .slice(0, 2)
              .map((crop, i, arr) => 
                i === arr.length - 1 
                  ? ` and ${crop.name}`
                  : ` ${crop.name}`
              )}.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 18,
    color: '#6B7280',
  },
  header: {
    backgroundColor: '#10B981', // green-500
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  tabContainer: {
    flexDirection: 'row',
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'white',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#10B981',
  },
  tabText: {
    fontSize: 16,
    color: '#4B5563',
    fontWeight: '500',
  },
  activeTabText: {
    color: 'white',
  },
  pricesContainer: {
    margin: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tableHeaderCell: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4B5563',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  evenRow: {
    backgroundColor: '#FAFAFA',
  },
  tableCell: {
    fontSize: 16,
    color: '#1F2937',
  },
  marketsContainer: {
    margin: 16,
  },
  marketCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  marketCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  marketName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  distanceBadge: {
    backgroundColor: '#10B981',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 16,
  },
  distanceText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  marketDetails: {
    padding: 16,
  },
  marketDetail: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  marketDetailLabel: {
    width: 120,
    fontSize: 14,
    color: '#6B7280',
  },
  marketDetailValue: {
    flex: 1,
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },
  directionButton: {
    backgroundColor: '#EFF6FF',
    padding: 12,
    alignItems: 'center',
  },
  directionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3B82F6',
  },
  marketTipsSection: {
    margin: 16,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  tipCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 16,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22,
  },
}); 