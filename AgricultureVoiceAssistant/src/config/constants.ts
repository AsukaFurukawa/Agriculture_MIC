export const API_BASE_URL = 'http://your-backend-url:3000';

export const SUPPORTED_LANGUAGES = {
  HINDI: 'hi-IN',
  ENGLISH: 'en-IN',
  MARATHI: 'mr-IN',
  GUJARATI: 'gu-IN',
  PUNJABI: 'pa-IN',
  TAMIL: 'ta-IN',
  TELUGU: 'te-IN',
  KANNADA: 'kn-IN',
  BENGALI: 'bn-IN',
  MALAYALAM: 'ml-IN',
};

export const DEFAULT_LANGUAGE = SUPPORTED_LANGUAGES.HINDI;

export const LANGUAGE_CONFIGS = {
  'kn-IN': {
    // Kannada language config
    welcomeMessage: 'ನಮಸ್ಕಾರ! ನಿಮ್ಮ ಭೂಮಿಯ ಮಾಹಿತಿ ಹೇಳಿ',
    voiceCommands: {
      weather: ['ಹವಾಮಾನ ಹೇಗಿದೆ?', 'ಮಳೆ ಬರುತ್ತಾ?'],
      prices: ['ರಾಗಿ ಬೆಲೆ ಎಷ್ಟು?', 'ಅಕ್ಕಿ ದರ ಹೇಳಿ'],
      land: ['ನನ್ನ ಹತ್ತಿರ 10 ಎಕರೆ ಇದೆ', 'ಯಾವ ಬೆಳೆ ಬೆಳೆಯಬೇಕು?']
    },
    crops: {
      'ರಾಗಿ': 'Ragi',
      'ಅಕ್ಕಿ': 'Rice',
      'ಹತ್ತಿ': 'Cotton'
    }
  },
  'ta-IN': {
    welcomeMessage: 'வணக்கம்! உங்கள் நிலத்தின் தகவலை சொல்லுங்கள்',
    voiceCommands: {
      weather: ['வானிலை எப்படி உள்ளது?', 'மழை வருமா?'],
      prices: ['நெல் விலை என்ன?', 'கரும்பு விலை சொல்லுங்கள்'],
      land: ['என்னிடம் 10 ஏக்கர் நிலம் உள்ளது', 'என்ன பயிர் செய்யலாம்?']
    },
    crops: {
      'நெல்': 'Rice',
      'கரும்பு': 'Sugarcane',
      'நிலக்கடலை': 'Groundnut'
    }
  },
  'te-IN': {
    welcomeMessage: 'నమస్కారం! మీ భూమి వివరాలు చెప్పండి',
    voiceCommands: {
      weather: ['వాతావరణం ఎలా ఉంది?', 'వర్షం వస్తుందా?'],
      prices: ['వరి ధర ఎంత?', 'పత్తి ధర చెప్పండి'],
      land: ['నా దగ్గర 10 ఎకరాలు ఉంది', 'ఏ పంట వేయాలి?']
    },
    crops: {
      'వరి': 'Rice',
      'పత్తి': 'Cotton',
      'మిర్చి': 'Chilli',
      'వేరుశనగ': 'Groundnut'
    }
  },
  'ml-IN': {
    welcomeMessage: 'നമസ്കാരം! നിങ്ങളുടെ ഭൂമിയുടെ വിവരങ്ങൾ പറയൂ',
    voiceCommands: {
      weather: ['കാലാവസ്ഥ എങ്ങനെയുണ്ട്?', 'മഴ വരുമോ?'],
      prices: ['നെല്ലിന്റെ വില എത്രയാണ്?', 'റബ്ബറിന്റെ വില പറയൂ'],
      land: ['എനിക്ക് 10 ഏക്കർ സ്ഥലമുണ്ട്', 'എന്ത് കൃഷി ചെയ്യണം?']
    },
    crops: {
      'നെല്ല്': 'Rice',
      'റബ്ബർ': 'Rubber',
      'തേങ്ങ': 'Coconut',
      'കുരുമുളക്': 'Pepper',
      'ഏലം': 'Cardamom'
    }
  }
};

// Regional crop suggestions based on state
export const REGIONAL_CROPS = {
  'Karnataka': {
    mainCrops: ['Ragi', 'Coffee', 'Arecanut', 'Millet'],
    soilTypes: ['Red soil', 'Black soil'],
    typicalRainfall: '750-850mm'
  },
  'Kerala': {
    mainCrops: ['Rubber', 'Coconut', 'Pepper', 'Cardamom'],
    soilTypes: ['Laterite soil', 'Forest loam'],
    typicalRainfall: '3000mm'
  },
  'Andhra Pradesh': {
    mainCrops: ['Rice', 'Cotton', 'Chilli', 'Tobacco'],
    soilTypes: ['Black cotton soil', 'Red soil'],
    typicalRainfall: '500-600mm'
  },
  'Tamil Nadu': {
    mainCrops: ['Rice', 'Sugarcane', 'Groundnut', 'Cotton'],
    soilTypes: ['Red soil', 'Alluvial soil'],
    typicalRainfall: '600-700mm'
  }
};

// Common weather patterns by region
export const WEATHER_PATTERNS = {
  'Coastal': {
    monsoon: 'June-September',
    irrigation: 'Moderate needs',
    risks: ['Cyclones', 'Salt spray']
  },
  'Plains': {
    monsoon: 'July-September',
    irrigation: 'High needs',
    risks: ['Drought', 'Heat waves']
  },
  'Western Ghats': {
    monsoon: 'June-October',
    irrigation: 'Low needs',
    risks: ['Heavy rainfall', 'Landslides']
  }
};

export const UI_ELEMENTS = {
  // Weather Icons with clear meanings
  WEATHER_ICONS: {
    SUNNY: '☀️',
    RAINY: '🌧️',
    CLOUDY: '☁️',
    STORM: '⛈️',
    HAIL: '🌨️',
  },

  // Crop Status Indicators
  CROP_ICONS: {
    HEALTHY: '🌾',
    NEEDS_WATER: '💧',
    PEST_ALERT: '⚠️',
    HARVEST_TIME: '🚜',
    SOWING_TIME: '🌱',
  },

  // Market Trends
  PRICE_INDICATORS: {
    RISING: '📈',
    FALLING: '📉',
    STABLE: '➡️',
    BEST_PRICE: '💰',
    LOW_PRICE: '⚠️',
  },

  // Action Buttons
  ACTION_ICONS: {
    SPEAK: '🎙️',
    LISTEN: '🔊',
    HELP: '❓',
    ALERT: '🚨',
    CALL: '📞',
  },

  // Visual Progress Indicators
  PROGRESS_INDICATORS: {
    LOADING: '⏳',
    SUCCESS: '✅',
    ERROR: '❌',
    WARNING: '⚠️',
    INFO: 'ℹ️',
  }
}; 