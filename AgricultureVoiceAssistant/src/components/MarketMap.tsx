import { useEffect } from 'react';

export const MarketMap = () => {
  useEffect(() => {
    if (Platform.OS === 'web' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        // Initialize map with nearby markets
        initializeMap(position.coords.latitude, position.coords.longitude);
      });
    }
  }, []);
}; 