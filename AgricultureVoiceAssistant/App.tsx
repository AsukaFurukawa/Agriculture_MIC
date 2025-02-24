import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import HomeScreen from './src/screens/HomeScreen';
import WeatherScreen from './src/screens/WeatherScreen';
import MarketScreen from './src/screens/MarketScreen';
import CropAdviceScreen from './src/screens/CropAdviceScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: '#F5E6CA', // Newspaper-like color
            },
            cardStyle: {
              backgroundColor: '#F5E6CA',
            },
          }}>
          <Stack.Screen 
            name="Home" 
            component={HomeScreen}
            options={{ title: 'किसान समाचार' }} // Hindi title for "Farmer's News"
          />
          <Stack.Screen 
            name="Weather" 
            component={WeatherScreen}
            options={{ title: 'मौसम' }}
          />
          <Stack.Screen 
            name="Market" 
            component={MarketScreen}
            options={{ title: 'बाज़ार' }}
          />
          <Stack.Screen 
            name="CropAdvice" 
            component={CropAdviceScreen}
            options={{ title: 'फसल सलाह' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App; 