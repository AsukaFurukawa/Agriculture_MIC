import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Icon } from '../../components/Icon';

export default function WebFooter() {
  const currentYear = new Date().getFullYear();
  
  // Links for the footer
  const quickLinks = [
    { title: 'Home', link: '/' },
    { title: 'Weather Updates', link: '/weather' },
    { title: 'Market Trends', link: '/market' },
    { title: 'Farming Tips', link: '/tips' },
  ];
  
  const supportedLanguages = [
    'English', 'Hindi', 'Bengali', 'Tamil', 'Telugu', 'Marathi'
  ];
  
  return (
    <View style={styles.footer}>
      <View style={styles.container}>
        <View style={styles.grid}>
          <View style={styles.column}>
            <View style={styles.logoSection}>
              <View style={styles.logoContainer}>
                <Icon name="sprout" size={32} color="white" />
              </View>
              <Text style={styles.logoText}>Agri Assistant</Text>
            </View>
            <Text style={styles.description}>
              Empowering Indian farmers with voice technology and real-time agricultural insights.
            </Text>
          </View>
          
          <View style={styles.column}>
            <Text style={styles.columnTitle}>Quick Links</Text>
            <View style={styles.linksContainer}>
              {quickLinks.map((link, index) => (
                <TouchableOpacity key={index} style={styles.linkItem}>
                  <Text style={styles.linkText}>{link.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.column}>
            <Text style={styles.columnTitle}>Supported Languages</Text>
            <View style={styles.languageGrid}>
              {supportedLanguages.map((lang, index) => (
                <View key={index} style={styles.languageItem}>
                  <Text style={styles.linkText}>🇮🇳 {lang}</Text>
                </View>
              ))}
            </View>
          </View>
          
          <View style={styles.column}>
            <Text style={styles.columnTitle}>Contact</Text>
            <View style={styles.contactList}>
              <View style={styles.contactItem}>
                <Icon name="email" size={20} color="#10B981" />
                <Text style={styles.linkText}>support@agriassistant.com</Text>
              </View>
              <View style={styles.contactItem}>
                <Icon name="phone" size={20} color="#10B981" />
                <Text style={styles.linkText}>+91 1800-200-3000</Text>
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.copyright}>
          <Text style={styles.copyrightText}>&copy; {currentYear} Agri Assistant. All rights reserved.</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    backgroundColor: '#064E3B', // green-900
    paddingTop: 64,
    paddingBottom: 32,
  },
  container: {
    paddingHorizontal: 16,
    maxWidth: 1200,
    marginHorizontal: 'auto',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 48,
  },
  column: {
    width: '100%',
    maxWidth: 300,
    marginBottom: 32,
    marginRight: 16,
  },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  description: {
    fontSize: 14,
    color: '#A7F3D0', // green-200
    marginBottom: 24,
  },
  columnTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#065F46', // green-800
  },
  linksContainer: {
    gap: 8,
  },
  linkItem: {
    paddingVertical: 4,
  },
  linkText: {
    fontSize: 14,
    color: '#A7F3D0', // green-200
  },
  languageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  languageItem: {
    width: '45%',
    paddingVertical: 4,
  },
  contactList: {
    gap: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#065F46', // green-800
    marginBottom: 32,
  },
  copyright: {
    alignItems: 'center',
  },
  copyrightText: {
    fontSize: 14,
    color: '#A7F3D0', // green-200
  },
}); 