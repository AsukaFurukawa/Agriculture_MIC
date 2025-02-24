import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Voice from '@react-native-voice/voice';
import Tts from 'react-native-tts';
import { useLocation } from '../contexts/LocationContext';
import { weatherService } from '../services/weatherService';
import { marketService } from '../services/marketService';
import { languageDetectionService } from '../services/languageDetectionService';
import { UI_ELEMENTS } from '../config/constants';

export const HomeScreen = () => {
  const [isListening, setIsListening] = useState(false);
  const [weather, setWeather] = useState(null);
  const [prices, setPrices] = useState([]);
  const [tips, setTips] = useState([]);
  const { location } = useLocation();
  const [userLanguage, setUserLanguage] = useState('hi-IN');
  const [translations, setTranslations] = useState(languageDetectionService.TRANSLATIONS['hi-IN']);
  const [isRaining, setIsRaining] = useState(false);
  const [hasAlert, setHasAlert] = useState(false);
  const [needsWater, setNeedsWater] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setupLanguageAndVoice();
    fetchData();
  }, [location]);

  const setupLanguageAndVoice = async () => {
    try {
      // Detect state from location and set language
      const state = location?.state;
      const detectedLanguage = languageDetectionService.LANGUAGE_BY_STATE[state]?.code || 'hi-IN';
      setUserLanguage(detectedLanguage);
      setTranslations(languageDetectionService.TRANSLATIONS[detectedLanguage]);

      // Setup voice recognition and TTS for detected language
      await Voice.destroy();
      await Voice.start(detectedLanguage);
      await Tts.setDefaultLanguage(detectedLanguage);

      // Setup voice listeners
      Voice.onSpeechStart = () => setIsListening(true);
      Voice.onSpeechEnd = () => setIsListening(false);
      Voice.onSpeechResults = onSpeechResults;

      // Welcome message in local language
      const welcome = await languageDetectionService.translateText(
        'Welcome! Tap the mic to ask about weather or prices',
        detectedLanguage
      );
      Tts.speak(welcome);

    } catch (error) {
      console.error('Language setup error:', error);
    }
  };

  const fetchData = async () => {
    try {
      const [weatherData, marketData] = await Promise.all([
        weatherService.getCurrentWeather(location.lat, location.lon),
        marketService.getCurrentPrices(location.state, location.district)
      ]);
      setWeather(weatherData);
      setPrices(marketData);
      
      // Speak out important updates
      const message = `नमस्ते! आज का मौसम ${weatherData.condition} है। 
        तापमान ${weatherData.temperature} डिग्री है। 
        ${weatherData.rainProbability > 50 ? 'बारिश की संभावना है' : ''}`;
      Tts.speak(message);

      setIsRaining(weatherData.rainProbability > 50);
      setHasAlert(weatherData.rainProbability > 50);
      setNeedsWater(weatherData.soilMoisture < 30);
    } catch (error) {
      console.error('Data fetch error:', error);
    }
  };

  const onSpeechResults = async (e) => {
    const command = e.value[0].toLowerCase();
    
    // Translate command to English for processing
    const englishCommand = await languageDetectionService.translateText(command, 'en-US');
    
    // Process command and get response in English
    let response = '';
    if (englishCommand.includes('weather')) {
      response = `The weather is ${weather.condition}. Temperature is ${weather.temperature}°C`;
    } 
    else if (englishCommand.includes('price')) {
      const crop = detectCropName(command);
      const price = prices.find(p => p.crop === crop);
      response = `The price of ${crop} is ${price.price} rupees per quintal`;
    }

    // Translate response back to user's language
    const localResponse = await languageDetectionService.translateText(response, userLanguage);
    Tts.speak(localResponse);
  };

  // Helper to detect crop names in different languages
  const detectCropName = (command: string) => {
    const cropPatterns = {
      'गेहूं': ['गेहूं', 'ਕਣਕ', 'గోధుమ', 'ಗೋಧಿ'],
      'धान': ['धान', 'ਝੋਨਾ', 'వరి', 'ಅಕ್ಕಿ'],
      // Add more crops and their names in different languages
    };

    for (const [crop, patterns] of Object.entries(cropPatterns)) {
      if (patterns.some(pattern => command.includes(pattern))) {
        return crop;
      }
    }
    return null;
  };

  const startListening = async () => {
    try {
      await Voice.start(userLanguage);
    } catch (error) {
      Alert.alert('Error', 'आवाज़ सुनने में समस्या है। कृपया पुनः प्रयास करें।');
    }
  };

  const startVoiceCommand = async () => {
    setIsLoading(true);
    await startListening();
    setIsLoading(false);
  };

  const showHelp = () => {
    // Implement showHelp functionality
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Big Weather Card */}
      <TouchableOpacity style={styles.weatherCard}>
        <View style={styles.weatherMain}>
          {/* Big Weather Icon */}
          <Text style={styles.weatherIcon}>
            {isRaining ? UI_ELEMENTS.WEATHER_ICONS.RAINY : UI_ELEMENTS.WEATHER_ICONS.SUNNY}
          </Text>
          <Text style={styles.temperature}>{weather?.temperature}°C</Text>
        </View>
        
        {/* Weather Alert if any */}
        {hasAlert && (
          <View style={styles.alertBanner}>
            <Text style={styles.alertIcon}>
              {UI_ELEMENTS.ACTION_ICONS.ALERT} 
              {UI_ELEMENTS.WEATHER_ICONS.RAINY}
            </Text>
            <Text style={styles.alertText}>आज शाम को भारी बारिश</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Crop Health Status */}
      <View style={styles.cropStatusContainer}>
        <Text style={styles.cropIcon}>
          {UI_ELEMENTS.CROP_ICONS.HEALTHY} धान की फसल स्वस्थ है
        </Text>
        {needsWater && (
          <Text style={styles.waterAlert}>
            {UI_ELEMENTS.CROP_ICONS.NEEDS_WATER} सिंचाई की जरूरत
          </Text>
        )}
      </View>

      {/* Market Prices with Big Trend Arrows */}
      <View style={styles.priceContainer}>
        <TouchableOpacity style={styles.priceCard}>
          <Text style={styles.cropName}>गेहूं</Text>
          <Text style={styles.priceIcon}>
            {UI_ELEMENTS.PRICE_INDICATORS.RISING}
          </Text>
          <Text style={styles.price}>₹{prices.find(p => p.crop === 'गेहूं')?.price || 'अज्ञात'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.priceCard}>
          <Text style={styles.cropName}>धान</Text>
          <Text style={styles.priceIcon}>
            {UI_ELEMENTS.PRICE_INDICATORS.FALLING}
          </Text>
          <Text style={styles.price}>₹{prices.find(p => p.crop === 'धान')?.price || 'अज्ञात'}</Text>
        </TouchableOpacity>
      </View>

      {/* Big Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.primaryButton]}
          onPress={startVoiceCommand}
        >
          <Text style={styles.buttonIcon}>
            {UI_ELEMENTS.ACTION_ICONS.SPEAK}
          </Text>
          <Text style={styles.buttonText}>बोलें</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.warningButton]}
          onPress={showHelp}
        >
          <Text style={styles.buttonIcon}>
            {UI_ELEMENTS.ACTION_ICONS.HELP}
          </Text>
          <Text style={styles.buttonText}>मदद</Text>
        </TouchableOpacity>
      </View>

      {/* Progress/Loading States */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <Text style={styles.loadingIcon}>
            {UI_ELEMENTS.PROGRESS_INDICATORS.LOADING}
          </Text>
          <Text style={styles.loadingText}>रुकिए...</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  weatherCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    gap: 16,
    elevation: 2,
  },
  weatherMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  weatherIcon: {
    fontSize: 72,  // Very large weather icons
  },
  temperature: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  alertBanner: {
    backgroundColor: colors.error,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  alertIcon: {
    fontSize: 24,
    color: 'white',
  },
  alertText: {
    fontSize: 16,
    color: 'white',
  },
  cropStatusContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginTop: 10,
    elevation: 2,
  },
  cropIcon: {
    fontSize: 48,  // Large crop status icons
  },
  priceContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginTop: 10,
    elevation: 2,
  },
  priceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  cropName: {
    fontSize: 16,
    flex: 1,
  },
  priceIcon: {
    fontSize: 36,  // Clear trend arrows
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  actionButton: {
    height: 100,
    width: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  warningButton: {
    backgroundColor: colors.warning,
  },
  buttonIcon: {
    fontSize: 40,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingIcon: {
    fontSize: 48,
    color: 'white',
    marginBottom: 10,
  },
  loadingText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
}); 