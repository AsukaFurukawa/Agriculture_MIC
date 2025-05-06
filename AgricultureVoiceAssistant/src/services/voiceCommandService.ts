import { NavigationProp } from '@react-navigation/native';
import { ENV } from '../config/env';

export const handleVoiceCommand = (command: string, navigation: NavigationProp<any>): string => {
  try {
    const lowerCommand = command.toLowerCase().trim();
    console.log('Processing command:', lowerCommand); // Debug log

    // Helper function to check if command includes any of the keywords
    const includesAny = (keywords: string[]) => 
      keywords.some(keyword => lowerCommand.includes(keyword.toLowerCase()));

    // Weather related keywords
    const weatherKeywords = [
      'मौसम', 'weather', 'बारिश', 'rain', 'तापमान', 'temperature',
      'गरमी', 'सर्दी', 'ठंड', 'धूप', 'बादल', 'हवा', 'आज', 'कल'
    ];

    // Market related keywords
    const marketKeywords = [
      'दाम', 'भाव', 'कीमत', 'रेट', 'price', 'rate', 'मंडी',
      'बाजार', 'market', 'बेचना', 'खरीदना', 'व्यापार'
    ];

    // Crop related keywords
    const cropKeywords = [
      'फसल', 'crop', 'खेती', 'farming', 'बुवाई', 'sowing',
      'बीज', 'seed', 'उगाना', 'पौधा', 'किसान', 'खाद'
    ];

    // Check for crop names in market queries
    if (includesAny(marketKeywords)) {
      const crops = Object.values(ENV.CROP_TYPES);
      const mentionedCrop = crops.find(crop => 
        lowerCommand.includes(crop.toLowerCase())
      );
      
      if (mentionedCrop) {
        navigation.navigate('Market', { crop: mentionedCrop });
        return ENV.VOICE_MESSAGES.MARKET_PRICE(mentionedCrop);
      }
      
      navigation.navigate('Market');
      return ENV.VOICE_MESSAGES.MARKET;
    }

    // Check other commands
    if (includesAny(weatherKeywords)) {
      navigation.navigate('Weather');
      return ENV.VOICE_MESSAGES.WEATHER;
    }

    if (includesAny(cropKeywords)) {
      navigation.navigate('CropAdvice');
      return ENV.VOICE_MESSAGES.CROP;
    }

    // If no command matched, log and return not understood message
    console.log('No matching command found for:', lowerCommand);
    return ENV.VOICE_MESSAGES.NOT_UNDERSTOOD;
  } catch (error) {
    console.error('Voice command handling error:', error);
    return ENV.VOICE_MESSAGES.ERROR;
  }
}; 