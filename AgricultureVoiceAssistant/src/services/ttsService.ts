import Tts from 'react-native-tts';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ttsService = {
  async init() {
    try {
      await Tts.setDefaultLanguage('hi-IN');
      await Tts.setDefaultRate(0.5);
      await Tts.setDefaultPitch(1.0);
    } catch (error) {
      console.error('TTS initialization error:', error);
    }
  },

  async speak(text: string, language = 'hi-IN') {
    try {
      await Tts.setDefaultLanguage(language);
      await Tts.speak(text);
    } catch (error) {
      console.error('TTS speak error:', error);
    }
  },

  stop() {
    Tts.stop();
  }
}; 