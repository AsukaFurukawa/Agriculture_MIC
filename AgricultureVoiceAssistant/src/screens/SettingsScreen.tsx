import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { LanguageSelector } from '../components/LanguageSelector';
import { useLanguage } from '../contexts/LanguageContext';
import { ttsService } from '../services/ttsService';

export const SettingsScreen = () => {
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = async (newLanguage: string) => {
    await setLanguage(newLanguage);
    // Speak a test message in the new language
    ttsService.speak('भाषा बदल दी गई है', newLanguage);
  };

  const clearCache = async () => {
    await ttsService.clearCache();
    // Show some feedback to user
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>भाषा चुनें</Text>
        <LanguageSelector
          currentLanguage={language}
          onLanguageChange={handleLanguageChange}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>कैश साफ़ करें</Text>
        <TouchableOpacity style={styles.button} onPress={clearCache}>
          <Text style={styles.buttonText}>कैश साफ़ करें</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5E6CA',
    padding: 16,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#FF6B6B',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 