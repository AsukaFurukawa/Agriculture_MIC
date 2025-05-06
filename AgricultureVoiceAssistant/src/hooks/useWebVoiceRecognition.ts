import { useState, useEffect } from 'react';
import { Platform } from 'react-native';

export const useVoiceRecognition = (language: string = 'hi-IN') => {
  const [isListening, setIsListening] = useState(false);
  const [text, setText] = useState('');

  const startListening = () => {
    if (Platform.OS === 'web') {
      // Web Speech API
      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.lang = language;
      recognition.continuous = true;
      
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        setText(transcript);
      };

      recognition.start();
    } else {
      // Use existing mobile voice recognition
      // Your existing mobile code here
    }
  };

  return { isListening, text, startListening };
}; 