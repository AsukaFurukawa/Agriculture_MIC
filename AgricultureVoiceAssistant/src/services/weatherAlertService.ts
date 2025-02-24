export const weatherAlertService = {
  async getUrgentAlerts(location: string, crop: string) {
    // Immediate voice alerts for:
    // 1. Unexpected rain/hail warnings
    // 2. Heat wave alerts
    // 3. Frost warnings
    // 4. What to do to protect crops
    
    return {
      alert: 'आज रात को ओले पड़ने की चेतावनी है',
      action: 'फसल को तुरंत ढक दें, यह कैसे करें सुनने के लिए बटन दबाएं',
      severity: 'HIGH'
    };
  }
}; 