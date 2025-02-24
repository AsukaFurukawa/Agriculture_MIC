import { useState, useCallback } from 'react';
import { ttsService } from '../services/ttsService';

export function useTTS() {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = useCallback(async (text: string, language?: string) => {
    try {
      setIsSpeaking(true);
      await ttsService.speak(text, language);
    } catch (error) {
      console.error('TTS error:', error);
    } finally {
      setIsSpeaking(false);
    }
  }, []);

  const stopSpeaking = useCallback(() => {
    // Implementation depends on whether we're using online or offline TTS
    ttsService.stop();
    setIsSpeaking(false);
  }, []);

  return {
    speak,
    stopSpeaking,
    isSpeaking,
  };
} 