import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export const SimpleCropAdviceScreen = () => {
  const [isListening, setIsListening] = useState(false);

  // Simple voice commands farmers can use
  const voicePrompts = [
    "मेरी जमीन के लिए कौन सी फसल अच्छी रहेगी?",
    "इस मौसम में क्या बोना चाहिए?",
    "अभी क्या बोने का समय है?"
  ];

  return (
    <View style={styles.container}>
      {/* Big Mic Button */}
      <TouchableOpacity 
        style={styles.micButton}
        onPress={() => startListening()}
      >
        <Icon 
          name={isListening ? "microphone" : "microphone-outline"} 
          size={50} 
          color="white" 
        />
        <Text style={styles.helpText}>
          बात करने के लिए यहाँ दबाएं
        </Text>
      </TouchableOpacity>

      {/* Simple Visual Cues */}
      <View style={styles.weatherHint}>
        <Icon name="weather-sunny" size={40} color={colors.primary} />
        <Text style={styles.hintText}>आज मौसम साफ है</Text>
      </View>

      {/* Voice Response Example */}
      <Text style={styles.response}>
        "आपकी 2 एकड़ जमीन के लिए अभी धान की बुवाई का सही समय है। 
        बारिश अच्छी होने की संभावना है।"
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
  },
  micButton: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  helpText: {
    fontSize: 18,
    color: 'white',
    marginTop: 10,
    textAlign: 'center',
  },
  weatherHint: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  hintText: {
    fontSize: 24,
    marginLeft: 10,
  },
  response: {
    fontSize: 22,
    padding: 20,
    textAlign: 'center',
    color: colors.text.primary,
  }
}); 