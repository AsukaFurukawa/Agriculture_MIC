import React from 'react';
import { StatusBar } from 'react-native';
import { LanguageProvider } from './contexts/LanguageContext';
import { LocationProvider } from './contexts/LocationContext';
import { AppNavigator } from './navigation/AppNavigator';
import { colors } from './theme/colors';

const App = () => {
  return (
    <LanguageProvider>
      <LocationProvider>
        <StatusBar 
          backgroundColor={colors.primary}
          barStyle="light-content"
        />
        <AppNavigator />
      </LocationProvider>
    </LanguageProvider>
  );
};

export default App; 