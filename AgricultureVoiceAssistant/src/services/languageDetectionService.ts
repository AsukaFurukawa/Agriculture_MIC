// First, let's create a language mapping service
export const LANGUAGE_BY_STATE = {
  'उत्तर प्रदेश': { code: 'hi-IN', name: 'Hindi' },
  'पंजाब': { code: 'pa-IN', name: 'Punjabi' },
  'महाराष्ट्र': { code: 'mr-IN', name: 'Marathi' },
  'गुजरात': { code: 'gu-IN', name: 'Gujarati' },
  'बिहार': { code: 'hi-IN', name: 'Hindi' },
  'कर्नाटक': { code: 'kn-IN', name: 'Kannada' },
  'तमिलनाडु': { code: 'ta-IN', name: 'Tamil' },
  'आंध्र प्रदेश': { code: 'te-IN', name: 'Telugu' },
  'बंगाल': { code: 'bn-IN', name: 'Bengali' }
};

// Translations for common phrases
export const TRANSLATIONS = {
  'hi-IN': {
    weather: 'मौसम',
    temperature: 'तापमान',
    rainChance: 'बारिश की संभावना',
    price: 'भाव',
    speak: 'बोलने के लिए दबाएं'
  },
  'pa-IN': {
    weather: 'ਮੌਸਮ',
    temperature: 'ਤਾਪਮਾਨ',
    rainChance: 'ਬਾਰਸ਼ ਦੀ ਸੰਭਾਵਨਾ',
    price: 'ਭਾਅ',
    speak: 'ਬੋਲਣ ਲਈ ਦਬਾਓ'
  },
  // Add more languages...
}; 