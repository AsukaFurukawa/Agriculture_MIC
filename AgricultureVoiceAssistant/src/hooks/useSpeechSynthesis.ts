import { useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export const useSpeechSynthesis = () => {
  const { language } = useLanguage();

  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      window.speechSynthesis.speak(utterance);
    }
  }, [language]);

  return { speak };
}; 