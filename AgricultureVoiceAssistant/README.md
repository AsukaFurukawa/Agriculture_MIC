# Agriculture Voice Assistant for Indian Farmers

A comprehensive voice-powered digital assistant designed specifically for Indian farmers, providing critical agricultural information through intuitive voice commands in multiple regional languages.

![Agriculture Voice Assistant](https://images.unsplash.com/photo-1629721671030-a83e3622cca1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80)

## 🌾 Overview

The Agriculture Voice Assistant is a mobile and web application that helps farmers access vital information about:

- 🌦️ **Weather forecasts** with farming-specific recommendations
- 💹 **Market prices** for various crops with selling advice
- 🌱 **Farming tips** tailored to specific crops and regions
- 📋 **Government schemes** available for agricultural support
- 🗺️ **Local market information** and buyer connections

What makes our application unique is that it's:
1. **Voice-first**: Fully controllable through voice commands
2. **Multilingual**: Supports 10 major Indian languages
3. **Accessible**: Works offline with minimal data requirements
4. **Contextual**: Provides locally relevant information based on the farmer's location and crops

## 🔍 Key Features

### Voice Assistant
- Natural language understanding for agricultural queries
- Responses in the farmer's preferred language
- Visual feedback along with voice responses
- Support for conversational interactions

### Weather Module
- Hyperlocal weather forecasts
- Weather-based farming recommendations
- Alerts for extreme weather conditions
- Seasonal planting calendars

### Market Intelligence
- Real-time crop price information
- Price trends and forecasts
- Selling recommendations
- Direct connection to buyers
- Information about nearby markets

### Farming Knowledge Base
- Seasonal farming tips
- Crop-specific advice
- Sustainable farming practices
- Technology adoption guidance

### Government Scheme Navigator
- Simplified information about agricultural programs
- Eligibility criteria and application help
- Deadlines and important dates
- Contact information for support

## 💻 Technologies Used

### Frontend
- React Native for cross-platform mobile app
- React for web interface
- React Native Web for shared code between platforms
- Material Community Icons for UI elements
- Animated API for smooth transitions

### Voice & Language
- Web Speech API for browser-based voice recognition
- React Native Voice for mobile platforms
- Support for 10 Indian languages including Hindi, Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada, Malayalam, and Punjabi

### Backend & Services
- Node.js for server-side logic
- OpenAI GPT for intelligent responses
- Weather data API integration
- Market price API integration
- MongoDB for data storage

## 📱 Supported Platforms
- Android mobile app
- iOS mobile app
- Progressive Web App (PWA) for all modern browsers

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher) or yarn
- React Native development environment (for mobile development)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/agriculture-voice-assistant.git
cd agriculture-voice-assistant
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env` file in the root directory and add:
```
OPENAI_API_KEY=your_openai_api_key
WEATHER_API_KEY=your_weather_api_key
MARKET_API_KEY=your_market_api_key
```

4. Start the development server:
```bash
# For web
npm run web
# or
yarn web

# For Android
npm run android
# or
yarn android

# For iOS
npm run ios
# or
yarn ios
```

## 🧪 Testing the Voice Interface

1. Open the application in a supported browser or on a mobile device
2. Click/tap the microphone button to activate the voice assistant
3. Speak a command, such as:
   - "What will the weather be like this week?"
   - "What is the current price of wheat?"
   - "Tell me about PM Kisan Yojana scheme"
   - "What crops should I plant this season?"

## 📘 Voice Command Examples

### Weather Commands
- "What's the weather forecast for the next 3 days?"
- "Will it rain tomorrow?"
- "Is it a good time to spray pesticides this week?"

### Market Commands
- "What is the current price of cotton?"
- "Where is the nearest market to sell rice?"
- "Should I sell my wheat now or wait?"
- "Who is buying sugarcane in my area?"

### Farming Tips Commands
- "How do I treat leaf curl in tomatoes?"
- "What fertilizer is best for rice?"
- "When should I sow wheat in Punjab?"
- "How can I prevent pest attacks on cotton?"

### Government Scheme Commands
- "Tell me about PM Kisan Samman Nidhi"
- "Am I eligible for crop insurance?"
- "How do I apply for the soil health card?"
- "What subsidies are available for drip irrigation?"

## 👥 Contributing

We welcome contributions from the community! If you'd like to contribute, please:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

Please ensure your code follows our style guide and includes appropriate tests.

## 📃 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Acknowledgements

- This project was created to support Indian farmers by providing accessible agricultural information
- Special thanks to all the agricultural experts who contributed their knowledge
- Weather data provided by OpenWeatherMap
- Market price data aggregated from various government APIs
- LLM capabilities powered by OpenAI

## 📞 Contact

For any queries or support, please contact:
- Email: support@agrivoice.example.com
- Website: www.agrivoice.example.com

---

⭐ If you find this project useful, please consider giving it a star on GitHub! 