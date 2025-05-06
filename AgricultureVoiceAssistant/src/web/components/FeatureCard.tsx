import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Icon } from '../../components/Icon';

interface FeatureCardProps {
  title: string;
  description: string;
  iconName: string;
  color: string;
  onPress: () => void;
}

export default function FeatureCard({ title, description, iconName, color, onPress }: FeatureCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  
  // Handle hover animations
  const handleHoverIn = () => {
    setIsHovered(true);
    Animated.spring(scaleAnim, {
      toValue: 1.03,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };
  
  const handleHoverOut = () => {
    setIsHovered(false);
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };
  
  // For React Native Web, we can use onMouseEnter and onMouseLeave
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <Animated.View
        style={[
          styles.card,
          {
            transform: [{ scale: scaleAnim }],
          }
        ]}
        onMouseEnter={handleHoverIn}
        onMouseLeave={handleHoverOut}
      >
        <View style={[styles.colorBar, { backgroundColor: color }]} />
        <View style={[styles.cornerDecoration, { backgroundColor: `${color}10` }]} />
        
        <View style={styles.content}>
          <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
            <Icon name={iconName} size={32} color={color} />
          </View>
          
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
          
          <View style={styles.viewDetailsContainer}>
            <Text style={[styles.viewDetails, { color }]}>View details</Text>
            <Animated.View 
              style={{ 
                transform: [{ 
                  translateX: isHovered ? 4 : 0 
                }],
              }}
            >
              <Icon name="arrow-right" size={20} color={color} />
            </Animated.View>
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    maxWidth: 340,
    height: 240,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  colorBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: 4,
    transform: [{ scaleX: 1 }],
    transformOrigin: 'left',
  },
  cornerDecoration: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 96,
    height: 96,
    borderBottomLeftRadius: 100,
  },
  content: {
    padding: 24,
    height: '100%',
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  viewDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewDetails: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },
}); 