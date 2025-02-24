import { SUPPORTED_LANGUAGES } from '../config/constants';
import { ENV } from '../config/env';
import Tts from 'react-native-tts';

export const speechService = {
  // Speech-to-Text using Google Cloud Speech
  async speechToText(audioBlob: Blob, language = SUPPORTED_LANGUAGES.HINDI) {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob);
      formData.append('languageCode', language);
      
      const response = await fetch(`${ENV.BACKEND_URL}/speech/recognize`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      return data.text;
    } catch (error) {
      console.error('Speech to text error:', error);
      throw error;
    }
  },

  // Text-to-Speech using your existing backend
  async textToSpeech(text: string, language = SUPPORTED_LANGUAGES.HINDI) {
    try {
      // Try online TTS first (your backend)
      const response = await fetch(`${ENV.BACKEND_URL}/tts/speak`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, languageCode: language }),
      });

      if (!response.ok) {
        throw new Error('Online TTS failed');
      }

      return await response.blob();
    } catch (error) {
      console.log('Falling back to offline TTS');
      // Fallback to offline TTS
      return new Promise((resolve, reject) => {
        Tts.setDefaultLanguage(language)
          .then(() => {
            Tts.speak(text);
            resolve(null);
          })
          .catch(reject);
      });
    }
  },

  // Fallback offline voice using React Native TTS
  async offlineSpeak(text: string, language = SUPPORTED_LANGUAGES.HINDI) {
    try {
      await Tts.setDefaultLanguage(language);
      await Tts.speak(text);
    } catch (error) {
      console.error('Offline TTS error:', error);
      throw error;
    }
  }
}; 