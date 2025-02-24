export const CROP_TYPES = {
  WHEAT: 'गेहूं',
  RICE: 'चावल',
  COTTON: 'कपास',
  SUGARCANE: 'गन्ना',
  POTATO: 'आलू',
  ONION: 'प्याज',
  TOMATO: 'टमाटर',
  SOYBEAN: 'सोयाबीन',
  MUSTARD: 'सरसों',
  CORN: 'मक्का'
};

export const STATES = {
  UP: 'उत्तर प्रदेश',
  MP: 'मध्य प्रदेश',
  PUNJAB: 'पंजाब',
  HARYANA: 'हरियाणा',
  RAJASTHAN: 'राजस्थान',
  BIHAR: 'बिहार',
  GUJARAT: 'गुजरात',
  MAHARASHTRA: 'महाराष्ट्र'
};

export const ENV = {
  // Backend URL
  PORT: process.env.PORT || 3000,
  
  // Weather API
  WEATHER_API_KEY: 'c6fdf8c40d9547a8a91141828250802',
  WEATHER_API_URL: 'https://api.weatherapi.com/v1',
  
  // Market data
  AGMARKNET_URL: 'https://agmarknet.gov.in/SearchCmmMkt.aspx',
  
  // LLM settings
  LLM_MODEL: 'simple', // 'simple' or 'advanced'
  LLM_TEMPERATURE: 0.7,
  
  // Cache settings
  CACHE_DURATION: 6 * 60 * 60 * 1000, // 6 hours in milliseconds
};

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
}; 