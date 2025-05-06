import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

export const useLocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  const getLocation = async () => {
    try {
      if (Platform.OS === 'web') {
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              });
            },
            (err) => setError(err.message)
          );
        }
      } else {
        // Mobile location
        Geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });
          },
          (err) => setError(err.message)
        );
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return { location, error, getLocation };
}; 