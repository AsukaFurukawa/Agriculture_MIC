export const webNotificationService = {
  async requestPermission() {
    if (!('Notification' in window)) return;
    
    return await Notification.requestPermission();
  },

  async sendWeatherAlert(message: string) {
    if (Notification.permission === 'granted') {
      new Notification('मौसम चेतावनी', {
        body: message,
        icon: '/weather-icon.png'
      });
    }
  }
}; 