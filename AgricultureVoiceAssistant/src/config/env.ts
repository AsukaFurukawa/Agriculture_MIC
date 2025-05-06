export const ENV = {
  // Backend URL (update port if different)
  BACKEND_URL: 'http://localhost:3000',
  
  // Weather API
  WEATHER_API_KEY: '3247f6539213497b82eca8d1fc9ef266',
  WEATHER_API_URL: 'https://api.weatherapi.com/v1',
  
  // OpenCage API (you'll need to sign up)
  OPENCAGE_API_KEY: '3247f6539213497b82eca8d1fc9ef266',
  
  // Market data
  AGMARKNET_URL: 'https://agmarknet.gov.in/SearchCmmMkt.aspx',
  
  // Backup APIs
  AZURE_SPEECH_KEY: 'your-azure-speech-key',
  AZURE_REGION: 'eastus',
  
  // Voice feedback messages
  VOICE_MESSAGES: {
    LISTENING: 'मैं सुन रहा हूं...',
    WEATHER: 'मौसम की जानकारी दिखा रहा हूं',
    MARKET: 'बाज़ार भाव दिखा रहा हूं',
    CROP: 'फसल सलाह दिखा रहा हूं',
    ERROR: 'माफ़ कीजिए, मैं आपकी बात नहीं समझ पाया',
    NOT_UNDERSTOOD: 'कृपया दोबारा कहें',
    MARKET_PRICE: (crop: string) => `${crop} का बाज़ार भाव दिखा रहा हूं`
  }
};

export const CROP_TYPES = {
  WHEAT: 'गेहूं',
  RICE: 'चावल',
  COTTON: 'कपास',
  SUGARCANE: 'गन्ना',
  POTATO: 'आलू',
  RAGI: 'रागी',
  JOWAR: 'ज्वार',
  BAJRA: 'बाजरा',
  MAIZE: 'मक्का'
};

export const STATES = {
  UP: 'उत्तर प्रदेश',
  MP: 'मध्य प्रदेश',
  PUNJAB: 'पंजाब',
  RAJASTHAN: 'राजस्थान',
  GUJARAT: 'गुजरात',
  MAHARASHTRA: 'महाराष्ट्र',
  KARNATAKA: 'कर्नाटक',
  AP: 'आंध्र प्रदेश'
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