import React, { createContext, useContext, useState, useEffect } from 'react';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ENV } from '../config/env';

interface Location {
  latitude: number;
  longitude: number;
  state?: string;
  district?: string;
}

interface LocationContextType {
  location: Location | null;
  loading: boolean;
  error: string | null;
  updateLocation: () => Promise<void>;
}

export const LocationContext = createContext<LocationContextType>({
  location: null,
  loading: false,
  error: null,
  updateLocation: async () => {},
});

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateLocation = async () => {
    setLoading(true);
    setError(null);

    try {
      // Try to get cached location first
      const cachedLocation = await AsyncStorage.getItem('userLocation');
      if (cachedLocation) {
        setLocation(JSON.parse(cachedLocation));
      }

      // Get current location
      Geolocation.getCurrentPosition(
        async position => {
          const newLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };

          // Get state and district from coordinates using reverse geocoding
          try {
            const response = await fetch(
              `https://api.opencagedata.com/geocode/v1/json?q=${newLocation.latitude}+${newLocation.longitude}&key=${ENV.OPENCAGE_API_KEY}&language=hi`
            );
            
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            if (data.results[0]) {
              const { state, state_district } = data.results[0].components;
              newLocation.state = state;
              newLocation.district = state_district;
            }
          } catch (error) {
            console.error('Geocoding error:', error);
            // Set default location if API fails
            newLocation.state = 'दिल्ली';
            newLocation.district = 'नई दिल्ली';
          }

          setLocation(newLocation);
          await AsyncStorage.setItem('userLocation', JSON.stringify(newLocation));
          setLoading(false);
        },
        error => {
          setError(error.message);
          setLoading(false);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } catch (e) {
      setError('Location error');
      setLoading(false);
    }
  };

  useEffect(() => {
    updateLocation();
  }, []);

  return (
    <LocationContext.Provider value={{ location, loading, error, updateLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext); 