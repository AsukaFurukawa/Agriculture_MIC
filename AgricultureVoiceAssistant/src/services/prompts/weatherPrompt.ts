export const generateWeatherPrompt = (location: string, date: string) => `
As an expert in traditional Indian farming and weather prediction, analyze the weather for ${location} on ${date}.

Consider these traditional indicators:
1. पंचांग (Panchang) predictions
2. स्थानीय मौसम के संकेत (Local weather signs)
3. पारंपरिक ज्ञान (Traditional knowledge)
4. पक्षी व्यवहार (Bird behavior)
5. वनस्पति संकेत (Plant indicators)

Also analyze:
1. Historical weather patterns
2. Geographical features (mountains, rivers, soil type)
3. Current season's trends
4. Impact on local crops

Provide a detailed response in Hindi with:
{
  "temperature": {
    "max": number,
    "min": number,
    "current": number
  },
  "conditions": {
    "main": string,
    "description": string,
    "traditional_signs": string[],
    "farming_advice": string[]
  },
  "humidity": number,
  "wind": {
    "speed": number,
    "direction": string,
    "impact_on_crops": string
  },
  "precipitation": {
    "chance": number,
    "type": string,
    "farming_implications": string
  },
  "alerts": {
    "type": string,
    "description": string,
    "precautions": string[]
  },
  "crop_specific_advice": {
    "suitable_activities": string[],
    "avoid_activities": string[],
    "protection_measures": string[]
  }
}`; 