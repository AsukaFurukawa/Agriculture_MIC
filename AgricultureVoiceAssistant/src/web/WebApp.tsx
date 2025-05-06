import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Animated, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import WebHeader from './components/WebHeader';
import WebFooter from './components/WebFooter';
import MicButton from './components/MicButton';
import FarmBackgroundCanvas from './components/FarmBackgroundCanvas';
import FeatureCard from './components/FeatureCard';
import { WebAppProvider } from './contexts/WebAppContext';
import WeatherPage from './pages/WeatherPage';
import MarketPage from './pages/MarketPage';
import TipsPage from './pages/TipsPage';
import SchemesPage from './pages/SchemesPage';

// Language detection mapping based on Indian states
const stateLanguageMap = {
  'Delhi': 'Hindi',
  'Maharashtra': 'Marathi',
  'Tamil Nadu': 'Tamil',
  'Karnataka': 'Kannada',
  'West Bengal': 'Bengali',
  'Gujarat': 'Gujarati',
  'Punjab': 'Punjabi',
  'Kerala': 'Malayalam',
  'Andhra Pradesh': 'Telugu',
  'Telangana': 'Telugu',
  // Default to Hindi for other states
};

// Get dominant language based on state
const getLanguageForState = (state) => {
  return stateLanguageMap[state] || 'Hindi';
};

export default function WebApp() {
  const [scrollY, setScrollY] = useState(0);
  const [userMessage, setUserMessage] = useState('');
  const [assistantResponse, setAssistantResponse] = useState('');
  const [language, setLanguage] = useState('Hindi');
  const [locationName, setLocationName] = useState('');
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [marketData, setMarketData] = useState(null);
  const [tipsData, setTipsData] = useState(null);
  const [landSize, setLandSize] = useState(null); // in acres
  const [recommendedCrops, setRecommendedCrops] = useState([]);
  const [currentPage, setCurrentPage] = useState('home');

  const conversationRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  
  // Detect user's location on mount
  useEffect(() => {
    detectUserLocation();
    
    // Animate title on mount
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Setup scroll listener
    const handleScroll = (event) => {
      setScrollY(event.nativeEvent.contentOffset.y);
    };
    
    return () => {
      // Cleanup if needed
    };
  }, [fadeAnim, scaleAnim]);
  
  // Detect user's location and set location and language
  const detectUserLocation = async () => {
    setLoading(true);
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              // Use reverse geocoding to get location details
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
              );
              const data = await response.json();
              
              // Extract location information
              const stateName = data.address.state || '';
              const districtName = data.address.county || data.address.city || '';
              const displayName = data.display_name || '';
              
              // Set location and update language based on state
              setState(stateName);
              setDistrict(districtName);
              setLocationName(districtName ? `${districtName}, ${stateName}` : stateName);
              
              // Set language based on state
              const detectedLanguage = getLanguageForState(stateName);
              setLanguage(detectedLanguage);
              
              // Fetch initial data based on location
              fetchWeatherData(latitude, longitude);
              fetchMarketData(stateName, districtName);
              fetchFarmingTips(stateName, detectedLanguage);
            } catch (error) {
              console.error('Error fetching location data:', error);
              setLocationName('India');
            }
            setLoading(false);
          },
          (error) => {
            console.error('Geolocation error:', error);
            setLocationName('India');
            setLoading(false);
          },
          { timeout: 10000, maximumAge: 60000 }
        );
      } else {
        console.log('Geolocation not supported');
        setLocationName('India');
        setLoading(false);
      }
    } catch (error) {
      console.error('Location detection error:', error);
      setLocationName('India');
      setLoading(false);
    }
  };
  
  // Fetch weather data based on coordinates
  const fetchWeatherData = async (latitude, longitude) => {
    try {
      // In a real implementation, you'd use a weather API
      // This is a mock for demonstration purposes
      const mockWeatherData = {
        temperature: Math.floor(Math.random() * 15) + 20, // 20-35°C
        condition: ['Clear', 'Partly Cloudy', 'Cloudy', 'Light Rain'][Math.floor(Math.random() * 4)],
        humidity: Math.floor(Math.random() * 30) + 40, // 40-70%
        windSpeed: Math.floor(Math.random() * 20) + 5, // 5-25 km/h
        forecast: [
          { day: 'Today', temp: Math.floor(Math.random() * 15) + 20, condition: 'Clear' },
          { day: 'Tomorrow', temp: Math.floor(Math.random() * 15) + 20, condition: 'Partly Cloudy' },
          { day: 'Day 3', temp: Math.floor(Math.random() * 15) + 20, condition: 'Light Rain' },
        ]
      };
      setWeatherData(mockWeatherData);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };
  
  // Fetch market data based on location
  const fetchMarketData = async (state, district) => {
    try {
      // In a real implementation, you'd use an API for market prices
      // This is a mock for demonstration purposes
      const mockMarketData = {
        crops: [
          { name: 'Wheat', price: Math.floor(Math.random() * 500) + 1800, trend: 'up', change: '+5%' },
          { name: 'Rice', price: Math.floor(Math.random() * 400) + 1600, trend: 'stable', change: '+1%' },
          { name: 'Cotton', price: Math.floor(Math.random() * 1000) + 5000, trend: 'down', change: '-3%' },
          { name: 'Sugarcane', price: Math.floor(Math.random() * 100) + 250, trend: 'up', change: '+2%' },
          { name: 'Potato', price: Math.floor(Math.random() * 400) + 800, trend: 'up', change: '+8%' },
        ],
        nearbyMarkets: [
          { name: `${district} Mandi`, distance: '5 km' },
          { name: `${state} Agricultural Market`, distance: '15 km' },
          { name: 'Regional Farmers Market', distance: '25 km' },
        ]
      };
      setMarketData(mockMarketData);
      // Calculate recommended crops
      calculateRecommendedCrops(mockMarketData.crops, state);
    } catch (error) {
      console.error('Error fetching market data:', error);
    }
  };
  
  // Fetch farming tips based on location and language
  const fetchFarmingTips = async (state, language) => {
    try {
      // In a real implementation, you'd use an API for region-specific farming tips
      // This is a mock for demonstration purposes
      const mockTipsData = {
        seasonal: [
          { title: 'Monsoon Preparation', description: 'Prepare your fields for the upcoming monsoon season by implementing proper drainage systems.' },
          { title: 'Pest Control', description: 'Apply neem oil as a natural pesticide to protect crops from common seasonal pests.' },
          { title: 'Soil Health', description: 'Add organic compost to improve soil health before the next planting season.' }
        ],
        crops: [
          { crop: 'Wheat', tip: 'Water wheat crops early in the morning for optimal results and water conservation.' },
          { crop: 'Rice', tip: 'Maintain proper water levels in paddy fields to prevent water stress.' },
          { crop: 'Cotton', tip: 'Monitor for bollworms regularly and use integrated pest management techniques.' }
        ],
        sustainable: [
          { title: 'Water Conservation', description: 'Implement drip irrigation to conserve water and deliver nutrients directly to plant roots.' },
          { title: 'Natural Fertilizers', description: 'Use cow dung and compost as natural alternatives to chemical fertilizers.' }
        ]
      };
      setTipsData(mockTipsData);
    } catch (error) {
      console.error('Error fetching farming tips:', error);
    }
  };
  
  // Calculate recommended crops based on market data and location
  const calculateRecommendedCrops = (crops, state) => {
    // In a real implementation, this would consider soil, climate, and detailed market analysis
    // This is a simplified model for demonstration
    const stateBasedCrops = {
      'Punjab': ['Wheat', 'Rice', 'Cotton'],
      'Maharashtra': ['Cotton', 'Sugarcane', 'Soybean'],
      'Gujarat': ['Cotton', 'Groundnut', 'Wheat'],
      'Tamil Nadu': ['Rice', 'Sugarcane', 'Coconut'],
      'Karnataka': ['Coffee', 'Sugarcane', 'Ragi'],
      'Kerala': ['Rubber', 'Coconut', 'Spices'],
      'West Bengal': ['Rice', 'Jute', 'Tea'],
      'Andhra Pradesh': ['Rice', 'Cotton', 'Chili'],
      'Telangana': ['Rice', 'Cotton', 'Maize'],
      'Delhi': ['Vegetables', 'Flowers', 'Wheat']
    };
    
    // Get crops suitable for this state
    const suitableCrops = stateBasedCrops[state] || ['Wheat', 'Rice', 'Vegetables'];
    
    // Sort crops by profitability (in a real app, this would be more sophisticated)
    const sortedByProfit = [...crops].sort((a, b) => {
      // If the crop is in the suitable list, give it a boost
      const aBoost = suitableCrops.includes(a.name) ? 1.2 : 1;
      const bBoost = suitableCrops.includes(b.name) ? 1.2 : 1;
      
      // Consider price trend
      const aTrendMultiplier = a.trend === 'up' ? 1.1 : a.trend === 'down' ? 0.9 : 1;
      const bTrendMultiplier = b.trend === 'up' ? 1.1 : b.trend === 'down' ? 0.9 : 1;
      
      // Calculate an overall score
      const aScore = a.price * aBoost * aTrendMultiplier;
      const bScore = b.price * bBoost * bTrendMultiplier;
      
      return bScore - aScore;
    });
    
    // Take top 3 recommended crops
    setRecommendedCrops(sortedByProfit.slice(0, 3).map(crop => ({
      ...crop,
      suitability: suitableCrops.includes(crop.name) ? 'High' : 'Medium',
      reason: suitableCrops.includes(crop.name) 
        ? `Well-suited for ${state}'s climate and soil conditions.` 
        : 'Based on current market prices and trends.'
    })));
  };
  
  // Scroll to conversation when there's a response
  useEffect(() => {
    if (assistantResponse && conversationRef.current) {
      conversationRef.current.scrollTo({ y: 300, animated: true });
    }
  }, [assistantResponse]);

  return (
    <WebAppProvider 
      value={{
        userMessage,
        setUserMessage,
        assistantResponse,
        setAssistantResponse,
        language,
        setLanguage,
        locationName,
        setLocationName,
        loading,
        setLoading,
        weatherData,
        marketData,
        tipsData,
        recommendedCrops,
        currentPage,
        setCurrentPage
      }}
    >
      <SafeAreaProvider>
        <WebHeader 
          onWeatherClick={() => setCurrentPage('weather')}
          onMarketClick={() => setCurrentPage('market')}
          onTipsClick={() => setCurrentPage('tips')}
          onSchemesClick={() => setCurrentPage('schemes')}
          onHomeClick={() => setCurrentPage('home')}
          currentPage={currentPage}
        />
        
        {currentPage === 'home' && (
          <ScrollView
            style={styles.container}
            onScroll={(e) => setScrollY(e.nativeEvent.contentOffset.y)}
            scrollEventThrottle={16}
          >
            {/* Hero Section */}
            <View style={styles.heroSection}>
              <FarmBackgroundCanvas scrollY={scrollY} />
              
              <View style={styles.heroContent}>
                <Animated.View style={{ 
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }],
                }}>
                  <Text style={styles.heroTitle}>Agriculture Voice Assistant</Text>
                  
                  <View style={styles.divider} />
                  
                  <Text style={styles.heroSubtitle}>
                    Your farming companion in {loading ? '...' : locationName || 'India'}
                  </Text>
                  
                  <View style={styles.infoBox}>
                    <Text style={styles.infoText}>
                      Just tap the microphone and speak in <Text style={styles.bold}>{language}</Text>
                    </Text>
                  </View>
                </Animated.View>
              </View>
            </View>
            
            {/* Conversation Section */}
            <View ref={conversationRef} style={styles.conversationSection}>
              {(userMessage || assistantResponse) && (
                <View style={styles.conversationContainer}>
                  {userMessage && (
                    <View style={styles.userMessage}>
                      <View style={styles.messageHeader}>
                        <View style={styles.avatar}>
                          {/* User icon goes here */}
                        </View>
                        <Text style={styles.messageHeaderText}>You asked:</Text>
                      </View>
                      <View style={styles.userMessageBubble}>
                        <Text style={styles.messageText}>{userMessage}</Text>
                      </View>
                    </View>
                  )}
                  
                  {assistantResponse && (
                    <View style={styles.assistantMessage}>
                      <View style={[styles.messageHeader, styles.assistantHeader]}>
                        <Text style={styles.messageHeaderText}>Assistant response:</Text>
                        <View style={[styles.avatar, styles.assistantAvatar]}>
                          {/* Assistant icon goes here */}
                        </View>
                      </View>
                      <View style={styles.assistantMessageBubble}>
                        <Text style={styles.messageText}>{assistantResponse}</Text>
                      </View>
                    </View>
                  )}
                </View>
              )}
            </View>
            
            {/* Features Section */}
            <View style={styles.featuresSection}>
              <View style={styles.featuresTitleContainer}>
                <Text style={styles.featuresTitle}>Explore Features</Text>
                <Text style={styles.featuresSubtitle}>
                  Discover the tools designed to help Indian farmers grow better crops and increase their yields
                </Text>
              </View>
              
              <View style={styles.featuresGrid}>
                <FeatureCard 
                  title="Weather Updates"
                  description="Get real-time weather information and forecasts tailored for your crops."
                  iconName="weather-partly-cloudy"
                  color="#3B82F6" // blue-500
                  onPress={() => setCurrentPage('weather')}
                />
                
                <FeatureCard 
                  title="Market Trends"
                  description="Track current crop prices and market trends to sell at the best time."
                  iconName="chart-line"
                  color="#10B981" // green-500
                  onPress={() => setCurrentPage('market')}
                />
                
                <FeatureCard 
                  title="Farming Tips"
                  description="Discover best practices and advice tailored to your crops and region."
                  iconName="lightbulb-on"
                  color="#F59E0B" // yellow-500
                  onPress={() => setCurrentPage('tips')}
                />
                
                <FeatureCard 
                  title="Government Schemes"
                  description="Find government programs and benefits available to support farmers."
                  iconName="file-document"
                  color="#8B5CF6" // purple-500
                  onPress={() => setCurrentPage('schemes')}
                />
              </View>
            </View>
            
            <WebFooter />
          </ScrollView>
        )}
        
        {currentPage === 'weather' && <WeatherPage />}
        {currentPage === 'market' && <MarketPage />}
        {currentPage === 'tips' && <TipsPage />}
        {currentPage === 'schemes' && <SchemesPage />}
        
        <MicButton />
      </SafeAreaProvider>
    </WebAppProvider>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC', // slate-50
  },
  heroSection: {
    height: 650,
    position: 'relative',
    overflow: 'hidden',
  },
  heroContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    zIndex: 10,
  },
  heroTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 16,
  },
  divider: {
    width: 160,
    height: 4,
    backgroundColor: '#FBBF24', // yellow-400
    marginBottom: 24,
    alignSelf: 'center',
  },
  heroSubtitle: {
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
    marginBottom: 24,
  },
  infoBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderRadius: 12,
    padding: 24,
    maxWidth: 400,
    alignSelf: 'center',
    backdropFilter: 'blur(8px)',
  },
  infoText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
  bold: {
    fontWeight: 'bold',
  },
  conversationSection: {
    padding: 16,
    marginTop: 16,
  },
  conversationContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 32,
    position: 'relative',
    overflow: 'hidden',
  },
  userMessage: {
    marginBottom: 24,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  assistantHeader: {
    justifyContent: 'flex-end',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E7EB', // gray-200
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  assistantAvatar: {
    backgroundColor: '#D1FAE5', // green-100
    marginLeft: 12,
    marginRight: 0,
  },
  messageHeaderText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#4B5563', // gray-700
  },
  userMessageBubble: {
    backgroundColor: '#F3F4F6', // gray-100
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#9CA3AF', // gray-400
    marginLeft: 20,
  },
  assistantMessageBubble: {
    backgroundColor: '#ECFDF5', // green-50
    borderRadius: 8,
    padding: 16,
    borderRightWidth: 4,
    borderRightColor: '#10B981', // green-500
    marginRight: 20,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#1F2937', // gray-800
  },
  featuresSection: {
    padding: 16,
    marginTop: 32,
    marginBottom: 48,
  },
  featuresTitleContainer: {
    marginBottom: 48,
    alignItems: 'center',
  },
  featuresTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937', // gray-800
    marginBottom: 16,
    textAlign: 'center',
  },
  featuresSubtitle: {
    fontSize: 16,
    color: '#6B7280', // gray-500
    textAlign: 'center',
    maxWidth: 600,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 24,
  },
}); 