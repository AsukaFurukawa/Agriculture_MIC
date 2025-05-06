export const calendarService = {
  async addToCalendar(farmingEvent: FarmingEvent) {
    if (Platform.OS === 'web') {
      const { google, outlook } = generateCalendarLinks(farmingEvent);
      return {
        google,
        outlook,
        ics: generateICSFile(farmingEvent)
      };
    } else {
      // Use react-native calendar
    }
  }
}; 