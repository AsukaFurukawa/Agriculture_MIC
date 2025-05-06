import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Pressable } from 'react-native';
import { useWebAppContext } from '../contexts/WebAppContext';
import { Icon } from '../../components/Icon';
import LanguageDropdown from './LanguageDropdown';

interface WebHeaderProps {
  onWeatherClick: () => void;
  onMarketClick: () => void;
  onTipsClick: () => void;
  onSchemesClick: () => void;
  onHomeClick: () => void;
  currentPage: string;
}

export default function WebHeader({
  onWeatherClick,
  onMarketClick,
  onTipsClick,
  onSchemesClick,
  onHomeClick,
  currentPage
}: WebHeaderProps) {
  const { locationName, loading } = useWebAppContext();
  const [scrolled, setScrolled] = useState(false);
  const translateY = React.useRef(new Animated.Value(-100)).current;
  const opacity = React.useRef(new Animated.Value(0)).current;
  
  // Handle scroll events to change navbar appearance
  useEffect(() => {
    // Initial animation
    Animated.timing(translateY, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
    
    Animated.timing(opacity, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
      delay: 200,
    }).start();
    
    // Add scroll listener for web
    const handleScroll = () => {
      if (typeof window !== 'undefined') {
        setScrolled(window.scrollY > 20);
      }
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [translateY, opacity]);

  const navItems = [
    { name: 'Weather', action: onWeatherClick },
    { name: 'Market', action: onMarketClick },
    { name: 'Tips', action: onTipsClick },
    { name: 'Schemes', action: onSchemesClick },
  ];

  return (
    <Animated.View 
      style={[
        styles.header,
        scrolled ? styles.headerScrolled : styles.headerTransparent,
        { transform: [{ translateY }] }
      ]}
    >
      <View style={styles.container}>
        <Animated.View style={[styles.logoContainer, { opacity }]}>
          <TouchableOpacity style={styles.logoButton} onPress={onHomeClick}>
            <View style={[
              styles.logoIcon,
              scrolled ? styles.logoIconScrolled : styles.logoIconTransparent
            ]}>
              <Icon 
                name="sprout" 
                size={28} 
                color={scrolled ? '#047857' : 'white'} 
              />
            </View>
            <View>
              <Text 
                style={[
                  styles.logoText,
                  scrolled ? styles.textDark : styles.textLight
                ]}
              >
                Agri Assistant
              </Text>
              <View style={styles.underline} />
            </View>
          </TouchableOpacity>
        </Animated.View>
        
        <Animated.View style={[styles.rightSection, { opacity }]}>
          {loading ? (
            <View style={[
              styles.locationPill,
              scrolled ? styles.pillScrolled : styles.pillTransparent
            ]}>
              <Icon 
                name="loading" 
                size={16} 
                color={scrolled ? '#6B7280' : 'white'} 
              />
              <Text style={[
                styles.locationText,
                scrolled ? styles.textDark : styles.textLight
              ]}>
                Loading...
              </Text>
            </View>
          ) : locationName ? (
            <View style={[
              styles.locationPill,
              scrolled ? styles.pillScrolled : styles.pillTransparent
            ]}>
              <Icon 
                name="map-marker" 
                size={16} 
                color={scrolled ? '#047857' : 'white'} 
              />
              <Text style={[
                styles.locationText,
                scrolled ? styles.textDark : styles.textLight
              ]}>
                {locationName}
              </Text>
            </View>
          ) : (
            <View style={[
              styles.locationPill,
              styles.warningPill,
              scrolled ? styles.warningPillScrolled : styles.warningPillTransparent
            ]}>
              <Text style={[
                styles.locationText,
                scrolled ? { color: '#92400E' } : { color: '#FBBF24' }
              ]}>
                Location unavailable
              </Text>
            </View>
          )}
          
          <LanguageDropdown />
          
          <View style={styles.navLinks}>
            {navItems.map((item) => (
              <TouchableOpacity 
                key={item.name} 
                style={[
                  styles.navLink,
                  scrolled ? styles.navLinkScrolled : styles.navLinkTransparent,
                  currentPage === item.name.toLowerCase() && styles.activeNavLink
                ]}
                onPress={item.action}
              >
                <Text style={[
                  styles.navLinkText,
                  scrolled ? styles.textDark : styles.textLight,
                  currentPage === item.name.toLowerCase() && styles.activeNavLinkText
                ]}>
                  {item.name}
                </Text>
                {currentPage === item.name.toLowerCase() && (
                  <View style={styles.activeIndicator} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  headerTransparent: {
    backgroundColor: 'transparent',
  },
  headerScrolled: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    paddingVertical: 8,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: 1200,
    marginHorizontal: 'auto',
  },
  logoContainer: {
    marginBottom: 8,
  },
  logoButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    padding: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  logoIconTransparent: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  logoIconScrolled: {
    backgroundColor: '#ECFDF5',
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  textLight: {
    color: 'white',
  },
  textDark: {
    color: '#1F2937',
  },
  underline: {
    height: 2,
    width: '100%',
    backgroundColor: '#22D3EE',
    marginTop: 4,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 4,
  },
  pillTransparent: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  pillScrolled: {
    backgroundColor: '#ECFDF5',
  },
  warningPill: {},
  warningPillTransparent: {
    backgroundColor: 'rgba(251, 191, 36, 0.2)',
  },
  warningPillScrolled: {
    backgroundColor: '#FEF3C7',
  },
  locationText: {
    fontSize: 14,
  },
  navLinks: {
    flexDirection: 'row',
    gap: 4,
  },
  navLink: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  navLinkTransparent: {
    backgroundColor: 'transparent',
  },
  navLinkScrolled: {
    backgroundColor: 'transparent',
  },
  navLinkText: {
    fontSize: 14,
    fontWeight: '500',
  },
  activeNavLink: {
    position: 'relative',
  },
  activeNavLinkText: {
    fontWeight: 'bold',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 8,
    right: 8,
    height: 2,
    backgroundColor: '#10B981',
    borderRadius: 1,
  },
}); 