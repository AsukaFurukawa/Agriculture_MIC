import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { WeatherScreen } from '../screens/WeatherScreen';
import { MarketScreen } from '../screens/MarketScreen';
import { CropAdviceScreen } from '../screens/CropAdviceScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { Icon } from '../components/Icon';
import { colors } from '../theme/colors';
import { StyleSheet, View } from 'react-native';
import { VoiceButton } from '../components/VoiceButton';

const Tab = createBottomTabNavigator();

export const AppNavigator = () => {
  console.log('AppNavigator rendering'); // Debug log

  return (
    <Tab.Navigator
      initialRouteName="Weather"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.vintage.paper,
          borderTopWidth: 0,
          elevation: 0,
          height: 60,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        },
        tabBarActiveTintColor: colors.vintage.gold,
        tabBarInactiveTintColor: colors.vintage.brown,
      }}
    >
      <Tab.Screen
        name="Weather"
        component={WeatherScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="weather-partly-cloudy" size={24} color={color} />
          ),
          tabBarLabel: 'मौसम',
        }}
      />
      <Tab.Screen
        name="Market"
        component={MarketScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="store" size={24} color={color} />
          ),
          tabBarLabel: 'बाज़ार',
        }}
      />
      <Tab.Screen
        name="CropAdvice"
        component={CropAdviceScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="sprout" size={24} color={color} />
          ),
          tabBarLabel: 'फसल',
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="cog" size={24} color={color} />
          ),
          tabBarLabel: 'सेटिंग्स',
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.card,
    borderTopWidth: 0,
    elevation: 8,
    height: 60,
    paddingBottom: 8,
    paddingTop: 8,
    position: 'absolute',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  voiceButtonContainer: {
    alignItems: 'center',
    height: 80,
    justifyContent: 'center',
    width: 80,
    marginTop: -30,
  },
}); 