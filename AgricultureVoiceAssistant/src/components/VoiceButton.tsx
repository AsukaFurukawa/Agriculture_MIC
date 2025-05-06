import React from 'react';
import { TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Icon } from './Icon';
import { colors } from '../theme/colors';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';

export const VoiceButton: React.FC = () => {
  const { isListening, startListening } = useVoiceRecognition();
  const scaleAnim = new Animated.Value(1);

  React.useEffect(() => {
    if (isListening) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      scaleAnim.setValue(1);
    }
  }, [isListening]);

  return (
    <TouchableOpacity
      onPress={startListening}
      style={styles.container}
      activeOpacity={0.7}
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Icon
          name={isListening ? 'microphone' : 'microphone-outline'}
          size={32}
          color={isListening ? colors.error : colors.primary}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
}); 