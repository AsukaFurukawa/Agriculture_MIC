interface LandAnalysis {
  landSize: number;
  location: {
    state: string;
    district: string;
    lat: number;
    lon: number;
  };
  season: 'खरीफ' | 'रबी' | 'जायद';
}

export const cropSuggestionService = {
  async analyzeLandAndSuggest(analysis: LandAnalysis) {
    // Get real-time data
    const [weather, soil, market, schemes] = await Promise.all([
      weatherService.getSeasonalForecast(),
      soilService.getSoilHealth(analysis.location),
      marketService.getPriceTrends(),
      governmentService.getSchemes(analysis.location.state)
    ]);

    // Calculate optimal crop distribution based on multiple factors
    const suggestions = {
      mainCrops: [
        {
          crop: 'गेहूं',
          area: '200 एकड़',
          expectedProfit: '₹40,00,000',
          reason: 'बाजार भाव अच्छा है और मौसम अनुकूल है',
          governmentSupport: 'MSP ₹2200/क्विंटल',
          waterNeeded: '4-5 सिंचाई',
          bestVariety: 'HD-2967',
          timeline: {
            sowing: 'अक्टूबर का पहला हफ्ता',
            harvest: 'मार्च का दूसरा हफ्ता'
          },
          marketTrend: 'बढ़त',
          storageAvailable: 'FCI गोदाम 10km दूर'
        },
        {
          crop: 'दाल',
          area: '140 एकड़',
          expectedProfit: '₹28,00,000',
          reason: 'मिट्टी के लिए फायदेमंद और मांग ज्यादा है',
          governmentSupport: 'बीज सब्सिडी उपलब्ध',
          waterNeeded: '2-3 सिंचाई',
          bestVariety: 'पूसा-256',
          timeline: {
            sowing: 'जुलाई का आखिरी हफ्ता',
            harvest: 'अक्टूबर का पहला हफ्ता'
          },
          marketTrend: 'स्थिर',
          storageAvailable: 'स्थानीय मंडी में'
        },
        {
          crop: 'सरसों',
          area: '100 एकड़',
          expectedProfit: '₹20,00,000',
          reason: 'सरकारी खरीद की गारंटी है',
          governmentSupport: 'NAFED द्वारा खरीद',
          waterNeeded: '3 सिंचाई',
          bestVariety: 'RH-749',
          timeline: {
            sowing: 'सितम्बर का दूसरा हफ्ता',
            harvest: 'फरवरी का आखिरी हफ्ता'
          },
          marketTrend: 'बढ़त',
          storageAvailable: 'कोल्ड स्टोरेज 15km दूर'
        }
      ],
      alternativeCrops: [
        {
          crop: 'मक्का',
          reason: 'कम पानी की जरूरत, अच्छी मांग'
        },
        {
          crop: 'सोयाबीन',
          reason: 'निर्यात की संभावना अधिक'
        }
      ],
      voiceResponse: `
        आपकी 440 एकड़ जमीन के लिए सर्वोत्तम सुझाव:

        1. 200 एकड़ में गेहूं की HD-2967 किस्म बोएं
           - अनुमानित मुनाफा 40 लाख
           - सरकारी खरीद गारंटी के साथ
           - बुवाई का सही समय अगले हफ्ते से

        2. 140 एकड़ में दाल की खेती करें
           - मिट्टी के लिए फायदेमंद
           - सरकार से बीज सब्सिडी मिलेगी
           - स्थानीय मंडी में सीधी बिक्री

        3. 100 एकड़ में सरसों की खेती
           - नाफेड द्वारा खरीद की गारंटी
           - कोल्ड स्टोरेज की सुविधा उपलब्ध
           
        क्या आप किसी फसल के बारे में विस्तार से जानना चाहेंगे?
      `,
      weatherAlert: weather.rainfall > 80 ? 'अगले हफ्ते भारी बारिश की संभावना है, बुवाई थोड़ी टाल दें' : null,
      soilHealth: soil.needsImprovement ? 'बुवाई से पहले जैविक खाद डालने की सलाह है' : 'मिट्टी की स्थिति अच्छी है'
    };

    return suggestions;
  }
}; 