export const ENV = {
  // Backend URL (update port if different)
  BACKEND_URL: 'http://10.0.2.2:3000', // Use this for Android emulator
  // BACKEND_URL: 'http://localhost:3000', // Use this for iOS simulator
  
  // Weather API
  WEATHER_API_KEY: 'c6fdf8c40d9547a8a91141828250802',
  WEATHER_API_URL: 'https://api.weatherapi.com/v1',
  
  // OpenCage API (you'll need to sign up)
  OPENCAGE_API_KEY: 'your_opencage_api_key',
  
  // Market data
  AGMARKNET_URL: 'https://agmarknet.gov.in/SearchCmmMkt.aspx',
  
  // Backup APIs
  AZURE_SPEECH_KEY: 'your-azure-speech-key',
  AZURE_REGION: 'eastus',
};

export const CROP_TYPES = {
  WHEAT: 'गेहूं',
  RICE: 'चावल',
  COTTON: 'कपास',
  SUGARCANE: 'गन्ना',
  POTATO: 'आलू',
  // Add more crops
};

export const STATES = {
  UP: 'उत्तर प्रदेश',
  MP: 'मध्य प्रदेश',
  PUNJAB: 'पंजाब',
  // Add more states
};

// Add supported languages from your backend
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