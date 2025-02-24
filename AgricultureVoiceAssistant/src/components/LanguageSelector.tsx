import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { SUPPORTED_LANGUAGES } from '../config/env';

interface LanguageSelectorProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
}

const languageOptions = Object.entries(SUPPORTED_LANGUAGES).map(([key, value]) => ({
  label: key,
  value: value,
}));

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLanguage,
  onLanguageChange,
}) => {
  return (
    <View style={styles.container}>
      <Dropdown
        style={styles.dropdown}
        data={languageOptions}
        maxHeight={300}
        labelField="label"
        valueField="value"
        value={currentLanguage}
        onChange={item => onLanguageChange(item.value)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  dropdown: {
    height: 50,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
}); 