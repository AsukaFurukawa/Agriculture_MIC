import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated, Text, Platform } from 'react-native';
import { useWebAppContext } from '../contexts/WebAppContext';
import { Icon } from '../../components/Icon';
import Voice from '@react-native-voice/voice';

// Greetings in different Indian languages
const greetings = {
  'English': 'Hello',
  'Hindi': 'नमस्ते',
  'Bengali': 'নমস্কার',
  'Tamil': 'வணக்கம்',
  'Telugu': 'నమస్కారం',
  'Marathi': 'नमस्कार',
  'Gujarati': 'નમસ્તે',
  'Kannada': 'ನಮಸ್ಕಾರ',
  'Malayalam': 'നമസ്കാരം',
  'Punjabi': 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ'
};

export default function MicButton() {
  const [isActive, setIsActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { 
    setUserMessage, 
    setAssistantResponse, 
    language,
    locationName,
    weatherData,
    marketData,
    tipsData,
    recommendedCrops
  } = useWebAppContext();
  
  // Animation values
  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  const buttonScale = React.useRef(new Animated.Value(1)).current;
  
  // Create a pulsing effect when inactive
  useEffect(() => {
    if (!isActive) {
      // Start the pulsing animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      // Stop the pulsing animation
      pulseAnim.setValue(1);
    }
    
    return () => {
      // Cleanup animation
      pulseAnim.stopAnimation();
    };
  }, [isActive, pulseAnim]);
  
  // Set up voice recognition
  useEffect(() => {
    // Initialize voice listeners and handlers
    function initVoice() {
      Voice.onSpeechStart = () => setIsRecording(true);
      Voice.onSpeechEnd = () => setIsRecording(false);
      Voice.onSpeechResults = (event) => {
        if (event.value && event.value[0]) {
          handleTranscription(event.value[0]);
        }
      };
      Voice.onSpeechError = (error) => {
        console.error('Speech recognition error:', error);
        setIsActive(false);
      };
    }

    // Initialize voice handlers
    initVoice();
    
    // Provide a greeting when component mounts
    const timer = setTimeout(() => {
      if (Platform.OS === 'web') {
        speakGreeting();
      }
    }, 2000);
    
    return () => {
      // Cleanup voice and timer
      Voice.destroy().then(() => Voice.removeAllListeners());
      clearTimeout(timer);
    };
  }, [language]);
  
  // Speak a greeting in the selected language
  const speakGreeting = () => {
    const greeting = greetings[language] || greetings['English'];
    const message = `${greeting}! ${getLocalizedWelcomeMessage()}`;
    speak(message);
  };
  
  // Get a localized welcome message
  const getLocalizedWelcomeMessage = () => {
    // In a real app, you would translate this based on the language
    // For now, we'll use English with context-specific details
    return `Welcome to Agriculture Voice Assistant. I'm here to help with farming information for ${locationName || 'your region'}.`;
  };
  
  // Text-to-speech function
  const speak = (text) => {
    if (!text) return;
    
    setIsSpeaking(true);
    
    if (Platform.OS === 'web' && 'speechSynthesis' in window) {
      // Web implementation using Web Speech API
      const speech = new SpeechSynthesisUtterance(text);
      
      // Try to find a voice that matches the selected language
      const voices = window.speechSynthesis.getVoices();
      const languageCode = getLanguageCode(language);
      const voice = voices.find(v => v.lang.startsWith(languageCode.split('-')[0]));
      
      if (voice) {
        speech.voice = voice;
        speech.lang = voice.lang;
      }
      
      speech.onend = () => {
        setIsSpeaking(false);
      };
      
      window.speechSynthesis.speak(speech);
    } else {
      // Native implementation would use react-native-tts
      // For now, just set a timeout
      setTimeout(() => {
        setIsSpeaking(false);
      }, 2000);
    }
  };
  
  const handlePress = async () => {
    try {
      setIsActive((prev) => !prev);
      
      // Button press animation
      Animated.sequence([
        Animated.timing(buttonScale, {
          toValue: 0.9,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(buttonScale, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
      
      if (!isActive) {
        // Start recording
        await Voice.start(getLanguageCode(language));
      } else {
        // Stop recording
        await Voice.stop();
      }
    } catch (error) {
      console.error('Voice recognition error:', error);
    }
  };
  
  const handleTranscription = (text: string) => {
    setUserMessage(text);
    
    // Process the user's query to generate a relevant response
    const response = generateResponse(text.toLowerCase(), language);
    setAssistantResponse(response);
    
    // Speak the response
    speak(response);
    
    // Automatically deactivate button after speaking
    setTimeout(() => {
      setIsActive(false);
    }, 500);
  };
  
  // Generate a response based on the user's query
  const generateResponse = (query: string, language: string) => {
    // Check for weather-related queries
    if (query.includes('weather') || query.includes('rain') || query.includes('मौसम') || 
        query.includes('বাবা') || query.includes('வானிலை')) {
      return generateWeatherResponse();
    }
    
    // Check for market-related queries
    if (query.includes('market') || query.includes('price') || query.includes('sell') || 
        query.includes('बाज़ार') || query.includes('দাম') || query.includes('விலை')) {
      return generateMarketResponse();
    }
    
    // Check for farming tips queries
    if (query.includes('tips') || query.includes('advice') || query.includes('help') || 
        query.includes('सलाह') || query.includes('পরামর্শ') || query.includes('உதவி')) {
      return generateTipsResponse();
    }
    
    // Check for crop recommendation queries
    if (query.includes('recommend') || query.includes('grow') || query.includes('best crop') || 
        query.includes('अनुशंसा') || query.includes('ফসল') || query.includes('பயிர்')) {
      return generateCropRecommendationResponse();
    }
    
    // Default response
    return `How can I assist you with your farming today? You can ask about weather, market prices, farming tips, or crop recommendations for your area.`;
  };
  
  // Generate a weather-specific response
  const generateWeatherResponse = () => {
    if (!weatherData) {
      return `I'm still fetching the latest weather data for your location. Please try again in a moment.`;
    }
    
    return `Current weather in ${locationName}: ${weatherData.temperature}°C, ${weatherData.condition}. 
    Humidity is ${weatherData.humidity}% with wind speed of ${weatherData.windSpeed} km/h. 
    Tomorrow's forecast: ${weatherData.forecast[1].temp}°C, ${weatherData.forecast[1].condition}.`;
  };
  
  // Generate a market-specific response
  const generateMarketResponse = () => {
    if (!marketData) {
      return `I'm still gathering market data for your region. Please try again shortly.`;
    }
    
    const topCrops = marketData.crops.slice(0, 3);
    const cropInfo = topCrops.map(crop => 
      `${crop.name}: ₹${crop.price} per quintal (${crop.change})`
    ).join(', ');
    
    return `Current market prices in your region: ${cropInfo}. 
    The nearest market is ${marketData.nearbyMarkets[0].name}, ${marketData.nearbyMarkets[0].distance} away.`;
  };
  
  // Generate a tips-specific response
  const generateTipsResponse = () => {
    if (!tipsData) {
      return `I'm preparing farming tips for your area. Please try again in a moment.`;
    }
    
    const seasonalTip = tipsData.seasonal[Math.floor(Math.random() * tipsData.seasonal.length)];
    const cropTip = tipsData.crops[Math.floor(Math.random() * tipsData.crops.length)];
    
    return `Seasonal tip: ${seasonalTip.title} - ${seasonalTip.description} 
    For ${cropTip.crop} crops: ${cropTip.tip}`;
  };
  
  // Generate a crop recommendation response
  const generateCropRecommendationResponse = () => {
    if (recommendedCrops.length === 0) {
      return `I'm analyzing the best crops for your region based on market trends and local conditions. Please try again shortly.`;
    }
    
    const topCrop = recommendedCrops[0];
    const secondCrop = recommendedCrops[1];
    
    return `Based on current market trends and your location, I recommend growing ${topCrop.name} (₹${topCrop.price} per quintal, ${topCrop.change}). 
    ${topCrop.reason} Another good option is ${secondCrop.name} (₹${secondCrop.price} per quintal).`;
  };
  
  // Map language name to language code
  const getLanguageCode = (lang: string): string => {
    const langMap: Record<string, string> = {
      'English': 'en-IN',
      'Hindi': 'hi-IN',
      'Bengali': 'bn-IN',
      'Tamil': 'ta-IN',
      'Telugu': 'te-IN',
      'Marathi': 'mr-IN',
      'Gujarati': 'gu-IN',
      'Kannada': 'kn-IN',
      'Malayalam': 'ml-IN',
      'Punjabi': 'pa-IN'
    };
    
    return langMap[lang] || 'en-IN';
  };

  return (
    <View style={styles.container}>
      {/* Pulse animation when inactive */}
      {!isActive && (
        <Animated.View 
          style={[
            styles.pulseCircle,
            {
              transform: [{ scale: pulseAnim }],
              opacity: pulseAnim.interpolate({
                inputRange: [1, 1.2],
                outputRange: [0, 0.6],
              }),
            }
          ]}
        />
      )}
      
      {/* Main button */}
      <Animated.View
        style={[
          {
            transform: [{ scale: buttonScale }],
          }
        ]}
      >
        <TouchableOpacity
          style={[
            styles.button,
            isActive ? styles.activeButton : styles.inactiveButton,
            isSpeaking && styles.speakingButton,
          ]}
          onPress={handlePress}
          activeOpacity={0.8}
          disabled={isSpeaking}
        >
          {isActive ? (
            <View style={styles.recordingIndicator}>
              <Animated.View
                style={[
                  styles.recordingDot,
                  {
                    opacity: isRecording ? 0.5 : 1
                  }
                ]}
              />
            </View>
          ) : isSpeaking ? (
            <Animated.View
              style={styles.soundWaves}
            >
              <Icon 
                name="volume-high" 
                size={28} 
                color="white" 
              />
            </Animated.View>
          ) : (
            <Icon 
              name="microphone" 
              size={32} 
              color="white" 
            />
          )}
        </TouchableOpacity>
      </Animated.View>
      
      {/* Status indicator */}
      {(isActive || isSpeaking) && (
        <View style={styles.statusIndicator}>
          <Text style={styles.statusText}>
            {isActive ? "Listening..." : isSpeaking ? "Speaking..." : ""}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  pulseCircle: {
    position: 'absolute',
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(59, 130, 246, 0.3)',
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  activeButton: {
    backgroundColor: 'white',
    borderWidth: 4,
    borderColor: 'rgba(16, 185, 129, 0.5)',
  },
  inactiveButton: {
    backgroundColor: '#3B82F6', // blue-500
  },
  speakingButton: {
    backgroundColor: '#8B5CF6', // purple-500
  },
  recordingIndicator: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EF4444', // red-500
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'white',
  },
  soundWaves: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: -20,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#3B82F6', // blue-600
  },
}); 