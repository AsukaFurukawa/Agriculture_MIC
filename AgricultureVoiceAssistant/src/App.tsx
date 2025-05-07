import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from './components/Icon';
import { colors } from './theme/colors';

const Tab = createBottomTabNavigator();

// Simple test screen
const SimpleWeatherScreen = () => (
  <View style={styles.container}>
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <Text style={styles.title}>मौसम</Text>
        <Text style={styles.subtitle}>मुंबई, महाराष्ट्र</Text>
      </View>
      <Icon name="weather-sunny" size={32} color="white" />
    </View>
    
    <View style={styles.content}>
      <View style={styles.weatherCard}>
        <View style={styles.tempContainer}>
          <Text style={styles.temp}>28°</Text>
          <Icon name="thermometer" size={48} color={colors.nature.sun} />
        </View>
        <Text style={styles.desc}>आज का मौसम साफ़ रहेगा</Text>
        
        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Icon name="water-percent" size={24} color={colors.nature.sky} />
            <Text style={styles.detailText}>65%</Text>
            <Text style={styles.detailLabel}>नमी</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Icon name="weather-windy" size={24} color={colors.nature.leaf} />
            <Text style={styles.detailText}>12 km/h</Text>
            <Text style={styles.detailLabel}>हवा</Text>
          </View>
        </View>
      </View>
    </View>
  </View>
);

const SimpleMarketScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>बाज़ार</Text>
  </View>
);

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#fff',
            height: 60,
            paddingBottom: 8,
          },
          tabBarActiveTintColor: colors.nature.leaf,
        }}
      >
        <Tab.Screen 
          name="Weather" 
          component={SimpleWeatherScreen}
          options={{
            tabBarLabel: 'मौसम',
            tabBarIcon: ({ color }) => (
              <Icon name="weather-sunny" size={24} color={color} />
            ),
          }}
        />
        <Tab.Screen 
          name="Market" 
          component={SimpleMarketScreen}
          options={{
            tabBarLabel: 'बाज़ार',
            tabBarIcon: ({ color }) => (
              <Icon name="store" size={24} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    backgroundColor: colors.nature.leaf,
    padding: 20,
    paddingTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  content: {
    padding: 20,
  },
  weatherCard: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 20,
    ...(Platform.OS === 'web' ? {
      boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)'
    } : {
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    }),
  },
  tempContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  temp: {
    fontSize: 72,
    fontWeight: 'bold',
    color: colors.vintage.darkBrown,
  },
  desc: {
    fontSize: 18,
    color: colors.vintage.brown,
    textAlign: 'center',
    marginBottom: 24,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: colors.vintage.parchment,
    paddingTop: 16,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.vintage.darkBrown,
    marginTop: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: colors.vintage.brown,
    marginTop: 4,
  },
}); 