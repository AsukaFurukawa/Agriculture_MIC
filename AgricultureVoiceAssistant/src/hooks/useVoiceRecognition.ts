import { useState, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { handleVoiceCommand } from '../services/voiceCommandService';
import { useLanguage } from '../contexts/LanguageContext';
import { useSpeechSynthesis } from './useSpeechSynthesis';
import { ENV } from '../config/env';

export const useVoiceRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const navigation = useNavigation();
  const { language } = useLanguage();
  const { speak } = useSpeechSynthesis();

  const startListening = useCallback(() => {
    try {
      if ('webkitSpeechRecognition' in window) {
        const recognition = new (window as any).webkitSpeechRecognition();
        
        // Configure recognition settings
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'hi-IN'; // Force Hindi recognition
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
          setIsListening(true);
          speak(ENV.VOICE_MESSAGES.LISTENING);
          console.log('Started listening...'); // Debug log
        };

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          const confidence = event.results[0][0].confidence;
          
          console.log('Recognized:', transcript); // Debug log
          console.log('Confidence:', confidence); // Debug log
          
          setTranscript(transcript);
          
          if (navigation) {
            const response = handleVoiceCommand(transcript, navigation);
            console.log('Command response:', response); // Debug log
            speak(response);
          }
        };

        recognition.onerror = (event: any) => {
          console.error('Recognition error:', event.error);
          setIsListening(false);
          speak(ENV.VOICE_MESSAGES.ERROR);
        };

        recognition.onend = () => {
          console.log('Recognition ended'); // Debug log
          setIsListening(false);
        };

        recognition.start();
      } else {
        console.error('Speech recognition not supported');
        speak('आपके ब्राउज़र में वॉइस रिकॉग्निशन सपोर्ट नहीं है');
      }
    } catch (error) {
      console.error('Voice recognition error:', error);
      setIsListening(false);
    }
  }, [navigation, speak]);

  return { isListening, transcript, startListening };
}; 