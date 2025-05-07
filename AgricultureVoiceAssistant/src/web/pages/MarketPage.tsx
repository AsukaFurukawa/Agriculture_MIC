import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Linking } from 'react-native';
import { useWebAppContext } from '../contexts/WebAppContext';
import { Icon } from '../../components/Icon';

export default function MarketPage() {
  const { marketData, locationName, language } = useWebAppContext();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('prices');
  
  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Function to translate text based on selected language
  const translate = (text) => {
    if (language === 'Hindi') {
      const translations = {
        'Market Dashboard': 'मंडी डैशबोर्ड',
        'Loading market data...': 'बाज़ार डेटा लोड हो रहा है...',
        'Crop Prices': 'फसल मूल्य',
        'Nearby Markets': 'आस-पास की मंडियां',
        'Crop': 'फसल',
        'Price (₹/qt)': 'मूल्य (₹/क्विंटल)',
        'Trend': 'प्रवृत्ति',
        'Change': 'परिवर्तन',
        'Trading Hours': 'व्यापार समय',
        'Trading Days': 'व्यापार दिन',
        'Contact': 'संपर्क',
        'Get Directions': 'रास्ता पाएं',
        'Market Tips': 'बाज़ार टिप्स',
        'Best Selling Time': 'बेचने का सर्वोत्तम समय',
        'Market Insights': 'बाज़ार अंतर्दृष्टि',
        'Consider selling soon to get the best rates.': 'सर्वोत्तम दरों के लिए जल्द बेचने पर विचार करें।',
        'Consider waiting if possible as prices might improve.': 'यदि संभव हो तो प्रतीक्षा करें क्योंकि कीमतें बेहतर हो सकती हैं।',
        'Prices are stable. Good time to sell if you need immediate returns.': 'कीमतें स्थिर हैं। यदि आपको तत्काल रिटर्न की आवश्यकता है तो बेचने का अच्छा समय है।',
        'The most profitable crops this season based on current trends are': 'वर्तमान रुझानों के आधार पर इस मौसम की सबसे लाभदायक फसलें हैं',
        'and': 'और'
      };
      return translations[text] || text;
    }
    return text;
  };
  
  if (isLoading || !marketData) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>{translate('Loading market data...')}</Text>
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
  
  // Function to open maps with directions
  const openDirections = (marketName, address) => {
    const destination = encodeURIComponent(`${marketName}, ${address}`);
    const url = Platform.select({
      ios: `maps://app?daddr=${destination}`,
      android: `google.navigation:q=${destination}`,
      web: `https://maps.google.com/maps?daddr=${destination}`
    });
    
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        // Fallback to web URL for all platforms if app linking fails
        Linking.openURL(`https://maps.google.com/maps?daddr=${destination}`);
      }
    });
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{translate('Market Dashboard')}</Text>
        <Text style={styles.headerSubtitle}>{locationName}</Text>
      </View>
      
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, selectedTab === 'prices' && styles.activeTab]} 
          onPress={() => setSelectedTab('prices')}
        >
          <Text style={[styles.tabText, selectedTab === 'prices' && styles.activeTabText]}>
            {translate('Crop Prices')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, selectedTab === 'markets' && styles.activeTab]} 
          onPress={() => setSelectedTab('markets')}
        >
          <Text style={[styles.tabText, selectedTab === 'markets' && styles.activeTabText]}>
            {translate('Nearby Markets')}
          </Text>
        </TouchableOpacity>
      </View>
      
      {selectedTab === 'prices' ? (
        <View style={styles.pricesContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { flex: 2 }]}>{translate('Crop')}</Text>
            <Text style={[styles.tableHeaderCell, { flex: 2 }]}>{translate('Price (₹/qt)')}</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1 }]}>{translate('Trend')}</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1 }]}>{translate('Change')}</Text>
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
                  <Text style={styles.marketDetailLabel}>{translate('Trading Hours')}</Text>
                  <Text style={styles.marketDetailValue}>{market.tradingHours}</Text>
                </View>
                <View style={styles.marketDetail}>
                  <Text style={styles.marketDetailLabel}>{translate('Trading Days')}</Text>
                  <Text style={styles.marketDetailValue}>{market.tradingDays}</Text>
                </View>
                <View style={styles.marketDetail}>
                  <Text style={styles.marketDetailLabel}>{translate('Contact')}</Text>
                  <Text style={styles.marketDetailValue}>{market.contactNumber}</Text>
                </View>
              </View>
              
              <TouchableOpacity 
                style={styles.directionButton}
                onPress={() => openDirections(market.name, market.address || locationName)}
              >
                <Icon name="map-marker" size={16} color="white" style={styles.directionIcon} />
                <Text style={styles.directionButtonText}>{translate('Get Directions')}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
      
      <View style={styles.marketTipsSection}>
        <Text style={styles.sectionTitle}>{translate('Market Tips')}</Text>
        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>{translate('Best Selling Time')}</Text>
          <Text style={styles.tipText}>
            {translate('Prices for')} {marketData.crops[0].name} {translate('are trending')} {marketData.crops[0].trend}. 
            {marketData.crops[0].trend.toLowerCase() === 'up' 
              ? translate(' Consider selling soon to get the best rates.') 
              : marketData.crops[0].trend.toLowerCase() === 'down' 
                ? translate(' Consider waiting if possible as prices might improve.') 
                : translate(' Prices are stable. Good time to sell if you need immediate returns.')}
          </Text>
        </View>
        
        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>{translate('Market Insights')}</Text>
          <Text style={styles.tipText}>
            {translate('The most profitable crops this season based on current trends are')}
            {marketData.crops
              .sort((a, b) => {
                const aValue = a.trend === 'up' ? 3 : a.trend === 'stable' ? 2 : 1;
                const bValue = b.trend === 'up' ? 3 : b.trend === 'stable' ? 2 : 1;
                return bValue - aValue;
              })
              .slice(0, 2)
              .map((crop, i, arr) => 
                i === arr.length - 1 
                  ? ` ${translate('and')} ${crop.name}`
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
    ...(Platform.OS === 'web' ? {
      boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)'
    } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    }),
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
    ...(Platform.OS === 'web' ? {
      boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)'
    } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    }),
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
    flexDirection: 'row',
    backgroundColor: '#3B82F6',
    borderRadius: 6,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  directionIcon: {
    marginRight: 6,
  },
  directionButtonText: {
    color: 'white',
    fontWeight: '500',
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