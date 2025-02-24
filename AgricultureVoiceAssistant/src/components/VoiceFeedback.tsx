import React from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTTS } from '../hooks/useTTS';

interface VoiceFeedbackProps {
  text: string;
  language?: string;
}

export const VoiceFeedback: React.FC<VoiceFeedbackProps> = ({ text, language }) => {
  const { speak, stopSpeaking, isSpeaking } = useTTS();

  const toggleSpeech = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speak(text, language);
    }
  };

  return (
    <TouchableOpacity onPress={toggleSpeech} style={styles.container}>
      {isSpeaking ? (
        <View style={styles.iconContainer}>
          <ActivityIndicator color="#FF4444" size="small" />
          <Icon name="volume-up" size={24} color="#FF4444" style={styles.icon} />
        </View>
      ) : (
        <Icon name="volume-up" size={24} color="#666666" />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginLeft: 8,
  },
}); 