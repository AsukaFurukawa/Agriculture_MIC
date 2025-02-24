import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { WeatherScreen } from '../screens/WeatherScreen';
import { MarketScreen } from '../screens/MarketScreen';
import { CropAdviceScreen } from '../screens/CropAdviceScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { CustomTabBar } from './CustomTabBar';

const Tab = createBottomTabNavigator();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBar={props => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tab.Screen name="Weather" component={WeatherScreen} />
        <Tab.Screen name="Market" component={MarketScreen} />
        <Tab.Screen name="CropAdvice" component={CropAdviceScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}; 