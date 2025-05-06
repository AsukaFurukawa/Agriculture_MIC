import React from 'react';
import { TouchableOpacity, StyleSheet, Text, Animated } from 'react-native';
import { Icon } from './Icon';
import { colors } from '../theme/colors';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';
import { useLanguage } from '../contexts/LanguageContext';

export const FloatingMic = () => {
  const { isListening, startListening } = useVoiceRecognition();
  const { currentLanguage } = useLanguage();
  const pulseAnim = new Animated.Value(1);

  React.useEffect(() => {
    if (isListening) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isListening]);

  const micText = {
    hi: 'बोलें',
    mr: 'बोला',
    te: 'మాట్లాడండి',
    ta: 'பேசவும்',
    kn: 'ಮಾತನಾಡಿ',
    bn: 'বলুন',
  }[currentLanguage] || 'Speak';

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={startListening}
      activeOpacity={0.8}
    >
      <Animated.View 
        style={[
          styles.micButton,
          { transform: [{ scale: pulseAnim }] },
          isListening && styles.listening
        ]}
      >
        <Icon 
          name="microphone" 
          size={32} 
          color={isListening ? colors.vintage.gold : colors.vintage.paper} 
        />
        <Text style={[
          styles.micText,
          isListening && styles.listeningText
        ]}>
          {micText}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 90,
    alignSelf: 'center',
    zIndex: 1000,
  },
  micButton: {
    backgroundColor: colors.vintage.darkBrown,
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    borderWidth: 3,
    borderColor: colors.vintage.gold,
  },
  listening: {
    backgroundColor: colors.vintage.paper,
    borderWidth: 4,
  },
  micText: {
    color: colors.vintage.paper,
    marginTop: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  listeningText: {
    color: colors.vintage.gold,
  },
}); 