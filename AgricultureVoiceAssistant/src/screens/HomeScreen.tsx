import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
} from 'react-native';
import Voice from '@react-native-voice/voice';
import Tts from 'react-native-tts';

const HomeScreen = ({ navigation }) => {
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    // Initialize voice commands
    Voice.onSpeechResults = onSpeechResults;
    Tts.setDefaultLanguage('hi-IN'); // Set default language to Hindi
    
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechResults = (e) => {
    const command = e.value[0].toLowerCase();
    handleVoiceCommand(command);
  };

  const handleVoiceCommand = (command) => {
    if (command.includes('मौसम') || command.includes('weather')) {
      navigation.navigate('Weather');
    } else if (command.includes('बाज़ार') || command.includes('market')) {
      navigation.navigate('Market');
    } else if (command.includes('सलाह') || command.includes('advice')) {
      navigation.navigate('CropAdvice');
    }
  };

  const startListening = async () => {
    try {
      await Voice.start('hi-IN');
      setIsListening(true);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>किसान समाचार</Text>
      
      <TouchableOpacity 
        style={styles.micButton}
        onPress={startListening}>
        <Image 
          source={require('../assets/mic-icon.png')}
          style={styles.micIcon}
        />
      </TouchableOpacity>

      <Text style={styles.helpText}>
        बोलने के लिए माइक पर टैप करें
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5E6CA',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#000000',
  },
  micButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FF4444',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  micIcon: {
    width: 60,
    height: 60,
    tintColor: '#FFFFFF',
  },
  helpText: {
    marginTop: 20,
    fontSize: 18,
    color: '#666666',
    textAlign: 'center',
  },
});

export default HomeScreen; 