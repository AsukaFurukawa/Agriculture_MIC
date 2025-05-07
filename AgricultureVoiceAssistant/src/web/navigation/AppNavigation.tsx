import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigate, useLocation } from 'react-router-dom';
import { Icon } from '../../components/Icon';

export default function AppNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const routes = [
    { name: 'Home', path: '/', icon: 'home' },
    { name: 'Weather', path: '/weather', icon: 'weather-partly-cloudy' },
    { name: 'Market', path: '/market', icon: 'chart-line' },
    { name: 'Tips', path: '/tips', icon: 'lightbulb-on' },
    { name: 'Predictions', path: '/predictions', icon: 'chart-areaspline' },
  ];
  
  return (
    <View style={styles.container}>
      {routes.map((route) => (
        <TouchableOpacity
          key={route.path}
          style={[
            styles.navItem,
            location.pathname === route.path && styles.activeNavItem
          ]}
          onPress={() => navigate(route.path)}
        >
          <Icon 
            name={route.icon} 
            size={24} 
            color={location.pathname === route.path ? '#3B82F6' : '#6B7280'} 
          />
          <Text 
            style={[
              styles.navText,
              location.pathname === route.path && styles.activeNavText
            ]}
          >
            {route.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  navItem: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  activeNavItem: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    color: '#6B7280',
  },
  activeNavText: {
    color: '#3B82F6',
    fontWeight: '500',
  },
}); 