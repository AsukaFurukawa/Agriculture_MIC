import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SUPPORTED_LANGUAGES } from '../config/env';
import { useLocation } from '../contexts/LocationContext';

type Language = 'hi' | 'mr' | 'te' | 'ta' | 'kn' | 'bn';

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
  translate: (key: string) => string;
}

const translations = {
  welcome: {
    hi: 'नमस्ते',
    mr: 'नमस्कार',
    te: 'నమస్కారం',
    ta: 'வணக்கம்',
    kn: 'ನಮಸ್ಕಾರ',
    bn: 'নমস্কার',
  },
  weather: {
    hi: 'मौसम',
    mr: 'हवामान',
    te: 'వాతావరణం',
    ta: 'வானிலை',
    kn: 'ಹವಾಮಾನ',
    bn: 'আবহাওয়া',
  },
  // Add more translations...
};

export const LanguageContext = createContext<LanguageContextType>({
  currentLanguage: 'hi',
  setLanguage: () => {},
  translate: () => '',
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('hi');
  const { location } = useLocation();

  useEffect(() => {
    // Load saved language preference
    AsyncStorage.getItem('userLanguage').then(savedLanguage => {
      if (savedLanguage) {
        setCurrentLanguage(savedLanguage as Language);
      } else if (location?.state) {
        // Set language based on state if no saved preference
        const stateLanguageMap: { [key: string]: string } = {
          'महाराष्ट्र': SUPPORTED_LANGUAGES.MARATHI,
          'गुजरात': SUPPORTED_LANGUAGES.GUJARATI,
          'पंजाब': SUPPORTED_LANGUAGES.PUNJABI,
          // Add more state-language mappings
        };
        
        const detectedLanguage = stateLanguageMap[location.state] || SUPPORTED_LANGUAGES.HINDI;
        setCurrentLanguage(detectedLanguage as Language);
        AsyncStorage.setItem('userLanguage', detectedLanguage);
      }
    });
  }, [location]);

  const translate = (key: string): string => {
    const sections = key.split('.');
    let result = translations;
    for (const section of sections) {
      result = result[section] || {};
    }
    return result[currentLanguage] || key;
  };

  return (
    <LanguageContext.Provider 
      value={{ 
        currentLanguage, 
        setLanguage: setCurrentLanguage,
        translate 
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext); 