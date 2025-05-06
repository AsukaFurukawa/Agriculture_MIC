import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { Icon } from '../components/Icon';
import { colors } from '../theme/colors';

const FeatureCard = ({ icon, title, value, color }) => (
  <TouchableOpacity style={styles.featureCard}>
    <Icon name={icon} size={32} color={color} />
    <Text style={styles.featureTitle}>{title}</Text>
    <Text style={styles.featureValue}>{value}</Text>
  </TouchableOpacity>
);

const WeatherAdvice = ({ icon, text, color }) => (
  <View style={styles.adviceCard}>
    <Icon name={icon} size={24} color={color} />
    <Text style={styles.adviceText}>{text}</Text>
  </View>
);

const ForecastDay = ({ day, date, high, low, icon }) => (
  <View style={styles.forecastDay}>
    <Text style={styles.forecastDate}>{date}</Text>
    <Icon name={icon} size={24} color={colors.nature.sun} />
    <Text style={styles.forecastTemp}>{high}° | {low}°</Text>
  </View>
);

const CropCalendar = ({ crop, stage, daysLeft, progress }) => (
  <View style={styles.cropCard}>
    <View style={styles.cropHeader}>
      <Icon name="sprout" size={24} color={colors.nature.leaf} />
      <Text style={styles.cropName}>{crop}</Text>
    </View>
    <View style={styles.progressBar}>
      <View style={[styles.progressFill, { width: `${progress}%` }]} />
    </View>
    <Text style={styles.cropStage}>{stage}</Text>
    <Text style={styles.daysLeft}>{daysLeft} दिन शेष</Text>
  </View>
);

// Weather Alert Component
const WeatherAlert = ({ type, message }) => (
  <Animated.View style={[styles.alertCard, type === 'warning' && styles.warningAlert]}>
    <Icon 
      name={type === 'warning' ? 'alert' : 'information'} 
      size={24} 
      color={type === 'warning' ? colors.warning : colors.info} 
    />
    <Text style={styles.alertText}>{message}</Text>
  </Animated.View>
);

// Forecast Card Component
const ForecastCard = ({ day, temp, icon, condition }) => (
  <View style={styles.forecastCard}>
    <Text style={styles.forecastDay}>{day}</Text>
    <Icon name={icon} size={24} color={colors.nature.sun} />
    <Text style={styles.forecastTemp}>{temp}°</Text>
    <Text style={styles.forecastCondition}>{condition}</Text>
  </View>
);

// Crop Advisory Component
const CropAdvisory = ({ crop, advice, icon }) => (
  <View style={styles.advisoryCard}>
    <View style={styles.advisoryHeader}>
      <Icon name={icon} size={24} color={colors.nature.leaf} />
      <Text style={styles.cropName}>{crop}</Text>
    </View>
    <Text style={styles.advisoryText}>{advice}</Text>
  </View>
);

// Add new component for market trends
const MarketTrend = ({ crop, price, change, trend }) => (
  <View style={styles.marketCard}>
    <Text style={styles.cropTitle}>{crop}</Text>
    <View style={styles.priceRow}>
      <Text style={styles.priceValue}>₹{price}/क्विंटल</Text>
      <View style={[styles.changeBadge, trend === 'up' ? styles.priceUp : styles.priceDown]}>
        <Icon 
          name={trend === 'up' ? 'trending-up' : 'trending-down'} 
          size={16} 
          color="white" 
        />
        <Text style={styles.changeText}>{change}%</Text>
      </View>
    </View>
  </View>
);

export const WeatherScreen = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Add animated components
  const AnimatedCard = Animated.createAnimatedComponent(View);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>मौसम</Text>
          <Text style={styles.subtitle}>मुंबई, महाराष्ट्र</Text>
        </View>
        <Icon name="weather-sunny" size={32} color="white" />
      </View>

      {/* Main Weather Card */}
      <Animated.View 
        style={[
          styles.mainCard,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <View style={styles.tempContainer}>
          <Text style={styles.temp}>28°</Text>
          <Icon name="thermometer" size={48} color={colors.nature.sun} />
        </View>
        <Text style={styles.weatherDesc}>आज का मौसम साफ़ रहेगा</Text>
        
        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Icon name="water-percent" size={24} color={colors.nature.sky} />
            <Text style={styles.detailValue}>65%</Text>
            <Text style={styles.detailLabel}>नमी</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="weather-windy" size={24} color={colors.nature.leaf} />
            <Text style={styles.detailValue}>12 km/h</Text>
            <Text style={styles.detailLabel}>हवा</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="weather-pouring" size={24} color={colors.nature.sky} />
            <Text style={styles.detailValue}>0 mm</Text>
            <Text style={styles.detailLabel}>वर्षा</Text>
          </View>
        </View>
      </Animated.View>

      {/* Weather Alerts */}
      <View style={styles.section}>
        <WeatherAlert 
          type="warning"
          message="कल तेज बारिश की संभावना है। फसल की सुरक्षा करें।"
        />
        <WeatherAlert 
          type="info"
          message="अगले सप्ताह बुवाई के लिए अनुकूल मौसम"
        />
      </View>

      {/* Weekly Forecast */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>सप्ताह का मौसम</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <ForecastCard day="सोम" temp="30" icon="weather-sunny" condition="साफ़" />
          <ForecastCard day="मंगल" temp="28" icon="weather-partly-cloudy" condition="आंशिक बादल" />
          <ForecastCard day="बुध" temp="29" icon="weather-cloudy" condition="बादल" />
          {/* Add more forecast cards */}
        </ScrollView>
      </View>

      {/* Crop Advisory */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>फसल सलाह</Text>
        <CropAdvisory 
          crop="गेहूं"
          advice="वर्तमान मौसम गेहूं की बुवाई के लिए उपयुक्त है।"
          icon="sprout"
        />
        <CropAdvisory 
          crop="धान"
          advice="सिंचाई की आवश्यकता है।"
          icon="water"
        />
      </View>

      {/* Market Section */}
      <View style={styles.marketSection}>
        <Text style={styles.sectionTitle}>बाज़ार भाव</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <MarketTrend 
            crop="गेहूं"
            price="2400"
            change="2.5"
            trend="up"
          />
          <MarketTrend 
            crop="धान"
            price="2100"
            change="1.2"
            trend="down"
          />
        </ScrollView>
      </View>

      {/* Voice Assistant Button */}
      <TouchableOpacity style={styles.voiceButton}>
        <Icon name="microphone" size={32} color="white" />
        <Text style={styles.voiceButtonText}>मौसम के बारे में पूछें</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.vintage.parchment,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
  },
  mainCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    elevation: 4,
  },
  tempContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  temp: {
    fontSize: 72,
    fontWeight: 'bold',
    color: colors.vintage.darkBrown,
  },
  weatherDesc: {
    fontSize: 18,
    color: colors.vintage.brown,
    marginBottom: 20,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  detailItem: {
    width: '33.33%',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.vintage.darkBrown,
    marginTop: 4,
  },
  detailLabel: {
    fontSize: 16,
    color: colors.vintage.brown,
    marginTop: 8,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.vintage.darkBrown,
    marginBottom: 16,
  },
  forecastCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    width: 80,
    elevation: 2,
  },
  forecastDay: {
    fontSize: 14,
    color: colors.vintage.brown,
    marginBottom: 8,
  },
  forecastTemp: {
    fontSize: 16,
    color: colors.vintage.darkBrown,
    marginTop: 8,
  },
  forecastCondition: {
    fontSize: 14,
    color: colors.vintage.brown,
    marginTop: 4,
  },
  marketSection: {
    padding: 20,
  },
  marketCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    width: 180,
    elevation: 2,
  },
  cropTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.vintage.darkBrown,
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceValue: {
    fontSize: 16,
    color: colors.vintage.brown,
  },
  changeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    borderRadius: 12,
  },
  priceUp: {
    backgroundColor: colors.success,
  },
  priceDown: {
    backgroundColor: colors.error,
  },
  changeText: {
    color: 'white',
    fontSize: 14,
    marginLeft: 4,
    fontWeight: 'bold',
  },
  voiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.vintage.darkBrown,
    margin: 20,
    padding: 16,
    borderRadius: 30,
    elevation: 4,
  },
  voiceButtonText: {
    color: colors.vintage.paper,
    fontSize: 18,
    marginLeft: 12,
  },
  advisoryCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  advisoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cropName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.vintage.darkBrown,
    marginLeft: 8,
  },
  advisoryText: {
    fontSize: 16,
    color: colors.vintage.brown,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  warningAlert: {
    backgroundColor: colors.warning,
  },
  alertText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: colors.vintage.paper,
  },
}); 