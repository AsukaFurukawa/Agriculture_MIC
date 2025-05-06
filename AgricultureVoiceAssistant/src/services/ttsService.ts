import { Platform } from 'react-native';
import RNTts from 'react-native-tts'; // for mobile

export const ttsService = {
  async init() {
    try {
      await RNTts.setDefaultLanguage('hi-IN');
      await RNTts.setDefaultRate(0.5);
      await RNTts.setDefaultPitch(1.0);
    } catch (error) {
      console.error('TTS initialization error:', error);
    }
  },

  async speak(text: string, language = 'hi-IN') {
    if (Platform.OS === 'web') {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      window.speechSynthesis.speak(utterance);
    } else {
      await RNTts.setDefaultLanguage(language);
      await RNTts.speak(text);
    }
  },

  stop() {
    if (Platform.OS === 'web') {
      window.speechSynthesis.cancel();
    } else {
      RNTts.stop();
    }
  }
}; 