export const schemeService = {
  async getUrgentSchemes(location: string) {
    // Alert about:
    // 1. PM-KISAN registration deadlines
    // 2. Crop insurance last dates
    // 3. Subsidy application deadlines
    // 4. Required documents list
    
    return {
      scheme: 'फसल बीमा योजना',
      lastDate: '15 दिन बाकी हैं',
      documents: ['आधार कार्ड', '7/12 उतारा'],
      nearestCenter: 'तहसील कार्यालय, 5km दूर'
    };
  }
}; 