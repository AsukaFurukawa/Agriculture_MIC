import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SUPPORTED_LANGUAGES } from '../config/env';

interface LanguageContextType {
  language: string;
  setLanguage: (language: string) => Promise<void>;
}

const LanguageContext = createContext<LanguageContextType>({
  language: SUPPORTED_LANGUAGES.HINDI,
  setLanguage: async () => {},
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState(SUPPORTED_LANGUAGES.HINDI);

  useEffect(() => {
    // Load saved language preference
    AsyncStorage.getItem('userLanguage').then(savedLanguage => {
      if (savedLanguage) {
        setLanguageState(savedLanguage);
      }
    });
  }, []);

  const setLanguage = async (newLanguage: string) => {
    await AsyncStorage.setItem('userLanguage', newLanguage);
    setLanguageState(newLanguage);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext); 