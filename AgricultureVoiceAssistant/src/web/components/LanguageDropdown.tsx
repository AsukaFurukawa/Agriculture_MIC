import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, ScrollView, Pressable, Platform } from 'react-native';
import { useWebAppContext } from '../contexts/WebAppContext';
import { Icon } from '../../components/Icon';

const LANGUAGES = [
  'English',
  'Hindi',
  'Bengali',
  'Tamil',
  'Telugu',
  'Marathi',
  'Gujarati',
  'Kannada',
  'Malayalam',
  'Punjabi'
];

// Language flag emojis
const LANGUAGE_FLAGS: Record<string, string> = {
  'English': '🇮🇳',
  'Hindi': '🇮🇳',
  'Bengali': '🇮🇳',
  'Tamil': '🇮🇳',
  'Telugu': '🇮🇳',
  'Marathi': '🇮🇳',
  'Gujarati': '🇮🇳',
  'Kannada': '🇮🇳',
  'Malayalam': '🇮🇳',
  'Punjabi': '🇮🇳'
};

export default function LanguageDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<View>(null);
  const { language, setLanguage } = useWebAppContext();
  
  // Animation values
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const dropdownAnim = useRef(new Animated.Value(0)).current;
  
  // Rotate chevron when dropdown opens/closes
  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: isOpen ? 1 : 0,
      duration: 300,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
    
    if (isOpen) {
      Animated.timing(dropdownAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: Platform.OS !== 'web',
      }).start();
    } else {
      Animated.timing(dropdownAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: Platform.OS !== 'web',
      }).start();
    }
  }, [isOpen, rotateAnim, dropdownAnim]);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (dropdownRef.current && event.target) {
        // This is a simplified check - in a real implementation,
        // you would need to create a proper DOM node reference check
        setIsOpen(false);
      }
    };
    
    if (typeof document !== 'undefined' && isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);
  
  const handleLanguageChange = (selectedLanguage: string) => {
    setLanguage(selectedLanguage);
    setIsOpen(false);
  };
  
  // Calculate rotation for dropdown chevron
  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={styles.container} ref={dropdownRef}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setIsOpen(!isOpen)}
        activeOpacity={0.7}
      >
        <Text style={styles.flag}>{LANGUAGE_FLAGS[language]}</Text>
        <Text style={styles.buttonText}>{language}</Text>
        <Animated.View style={{
          transform: [{ rotate: rotateInterpolate }],
        }}>
          <Icon name="chevron-down" size={16} color="#4B5563" />
        </Animated.View>
      </TouchableOpacity>
      
      {isOpen && (
        <Animated.View 
          style={[
            styles.dropdown,
            {
              opacity: dropdownAnim,
              transform: [
                { 
                  translateY: dropdownAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-10, 0],
                  })
                },
                { 
                  scale: dropdownAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.95, 1],
                  })
                },
              ],
            }
          ]}
        >
          <View style={styles.dropdownHeader}>
            <Text style={styles.dropdownHeaderText}>SELECT LANGUAGE</Text>
          </View>
          
          <ScrollView style={styles.languageList}>
            {LANGUAGES.map((lang, index) => (
              <TouchableOpacity
                key={lang}
                style={[
                  styles.languageItem,
                  lang === language && styles.selectedLanguageItem
                ]}
                onPress={() => handleLanguageChange(lang)}
              >
                <Text style={styles.flag}>{LANGUAGE_FLAGS[lang]}</Text>
                <Text 
                  style={[
                    styles.languageText,
                    lang === language && styles.selectedLanguageText
                  ]}
                >
                  {lang}
                </Text>
                
                {lang === language && (
                  <Icon name="check" size={16} color="#047857" />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    gap: 4,
  },
  buttonText: {
    fontSize: 14,
    color: 'white',
    marginHorizontal: 4,
  },
  flag: {
    fontSize: 16,
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: 8,
    width: 200,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    ...(Platform.OS === 'web' ? {
      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'
    } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    }),
    borderWidth: 1,
    borderColor: '#F3F4F6',
    overflow: 'hidden',
    zIndex: 100,
  },
  dropdownHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dropdownHeaderText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  languageList: {
    maxHeight: 300,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  selectedLanguageItem: {
    backgroundColor: '#F0FDF4',
  },
  languageText: {
    fontSize: 14,
    color: '#1F2937',
    flex: 1,
  },
  selectedLanguageText: {
    fontWeight: '500',
    color: '#047857',
  },
}); 