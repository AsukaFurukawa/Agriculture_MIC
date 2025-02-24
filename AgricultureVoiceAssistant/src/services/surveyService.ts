interface FarmerFeedback {
  location: string;
  language: string;
  landSize: number;
  mainChallenges: string[];
  featureRequests: string[];
  appUsageFrequency: string;
  preferredLanguage: string;
}

export const surveyService = {
  // Voice-based feedback collection
  async collectFeedback(language: string) {
    const questions = {
      'hi-IN': [
        // Basic info
        "आप किस जिले से हैं?",
        "आपके पास कितनी जमीन है?",
        
        // Key challenges
        "खेती में आपकी सबसे बड़ी समस्या क्या है?",
        "मौसम की जानकारी कैसे प्राप्त करते हैं?",
        "फसल बेचने में क्या दिक्कतें आती हैं?",
        
        // Financial aspects
        "क्या आपको लोन लेने में परेशानी होती है?",
        "सरकारी योजनाओं की जानकारी कैसे मिलती है?",
        
        // App specific
        "आप फोन का उपयोग कितना करते हैं?",
        "ऐप में और क्या सुविधाएं चाहिए?"
      ],

      'kn-IN': [
        // Same questions in Kannada
        "ನೀವು ಯಾವ ಜಿಲ್ಲೆಯವರು?",
        "ನಿಮ್ಮ ಹತ್ತಿರ ಎಷ್ಟು ಜಮೀನು ಇದೆ?",
        "ಕೃಷಿಯಲ್ಲಿ ನಿಮ್ಮ ಪ್ರಮುಖ ಸಮಸ್ಯೆ ಏನು?",
        // ... more questions
      ],

      'ta-IN': [
        // Tamil version
        "நீங்கள் எந்த மாவட்டத்தைச் சேர்ந்தவர்?",
        "உங்களிடம் எவ்வளவு நிலம் உள்ளது?",
        // ... more questions
      ],

      'te-IN': [
        // Telugu version
        "మీరు ఏ జిల్లా నుండి?",
        "మీ దగ్గర ఎంత భూమి ఉంది?",
        // ... more questions
      ]
    };

    // Make it conversational
    const voicePrompts = {
      'hi-IN': {
        welcome: "नमस्ते! आपकी मदद से हम इस ऐप को और बेहतर बनाना चाहते हैं",
        thankYou: "आपके सुझाव के लिए धन्यवाद",
        skip: "कोई बात नहीं, अगले सवाल पे चलते हैं"
      },
      // Add for other languages...
    };

    return {
      questions: questions[language],
      prompts: voicePrompts[language],
      voiceEnabled: true,
      canSkip: true,
      offlineSupport: true,
      estimatedTime: '5 minutes',
      rewards: {
        type: 'Mobile Recharge',
        value: '₹50'
      }
    };
  },

  async submitFeedback(feedback: FarmerFeedback) {
    try {
      // Store offline if no internet
      if (!navigator.onLine) {
        await storeOfflineFeedback(feedback);
        return { success: true, offline: true };
      }

      // Send to server
      const response = await fetch('/api/feedback', {
        method: 'POST',
        body: JSON.stringify(feedback)
      });

      return { success: true, reward: 'recharge_code' };
    } catch (error) {
      console.error('Feedback submission error:', error);
      return { success: false, offline: true };
    }
  }
}; 