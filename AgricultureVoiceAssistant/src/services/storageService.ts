import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const storageService = {
  setItem: async (key: string, value: any) => {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    }
  },

  getItem: async (key: string) => {
    if (Platform.OS === 'web') {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } else {
      const item = await AsyncStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    }
  }
}; 