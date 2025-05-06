import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useWebAppContext } from '../contexts/WebAppContext';

export default function TipsPage() {
  const { tipsData, locationName } = useWebAppContext();
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('seasonal');
  
  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading || !tipsData) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading farming tips...</Text>
      </View>
    );
  }
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Farming Tips</Text>
        <Text style={styles.headerSubtitle}>{locationName}</Text>
      </View>
      
      <View style={styles.categorySelector}>
        <TouchableOpacity 
          style={[styles.categoryButton, activeCategory === 'seasonal' && styles.activeCategoryButton]} 
          onPress={() => setActiveCategory('seasonal')}
        >
          <Text style={[styles.categoryButtonText, activeCategory === 'seasonal' && styles.activeCategoryButtonText]}>
            Seasonal
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.categoryButton, activeCategory === 'crops' && styles.activeCategoryButton]} 
          onPress={() => setActiveCategory('crops')}
        >
          <Text style={[styles.categoryButtonText, activeCategory === 'crops' && styles.activeCategoryButtonText]}>
            Crop Care
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.categoryButton, activeCategory === 'sustainable' && styles.activeCategoryButton]} 
          onPress={() => setActiveCategory('sustainable')}
        >
          <Text style={[styles.categoryButtonText, activeCategory === 'sustainable' && styles.activeCategoryButtonText]}>
            Sustainable
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.tipsContainer}>
        {activeCategory === 'seasonal' && (
          <>
            <Text style={styles.sectionTitle}>Seasonal Farming Tips</Text>
            {tipsData.seasonal.map((tip, index) => (
              <View key={index} style={styles.tipCard}>
                <View style={styles.tipHeader}>
                  <Text style={styles.tipTitle}>{tip.title}</Text>
                  <View style={styles.seasonalBadge}>
                    <Text style={styles.seasonalBadgeText}>Seasonal</Text>
                  </View>
                </View>
                <Text style={styles.tipDescription}>{tip.description}</Text>
                <TouchableOpacity style={styles.readMoreButton}>
                  <Text style={styles.readMoreButtonText}>Read More</Text>
                </TouchableOpacity>
              </View>
            ))}
          </>
        )}
        
        {activeCategory === 'crops' && (
          <>
            <Text style={styles.sectionTitle}>Crop-Specific Tips</Text>
            {tipsData.crops.map((tip, index) => (
              <View key={index} style={styles.tipCard}>
                <View style={styles.tipHeader}>
                  <Text style={styles.tipTitle}>{tip.crop}</Text>
                  <View style={[styles.seasonalBadge, styles.cropBadge]}>
                    <Text style={styles.seasonalBadgeText}>Crop</Text>
                  </View>
                </View>
                <Text style={styles.tipDescription}>{tip.tip}</Text>
                <TouchableOpacity style={styles.readMoreButton}>
                  <Text style={styles.readMoreButtonText}>Read More</Text>
                </TouchableOpacity>
              </View>
            ))}
          </>
        )}
        
        {activeCategory === 'sustainable' && (
          <>
            <Text style={styles.sectionTitle}>Sustainable Farming Practices</Text>
            {tipsData.sustainable.map((tip, index) => (
              <View key={index} style={styles.tipCard}>
                <View style={styles.tipHeader}>
                  <Text style={styles.tipTitle}>{tip.title}</Text>
                  <View style={[styles.seasonalBadge, styles.sustainableBadge]}>
                    <Text style={styles.seasonalBadgeText}>Sustainable</Text>
                  </View>
                </View>
                <Text style={styles.tipDescription}>{tip.description}</Text>
                <TouchableOpacity style={styles.readMoreButton}>
                  <Text style={styles.readMoreButtonText}>Read More</Text>
                </TouchableOpacity>
              </View>
            ))}
          </>
        )}
      </View>
      
      <View style={styles.expertAdviceSection}>
        <Text style={styles.sectionTitle}>Expert Advice</Text>
        <View style={styles.expertCard}>
          <View style={styles.expertInfo}>
            <View style={styles.expertAvatarPlaceholder}>
              <Text style={styles.expertInitials}>DR</Text>
            </View>
            <View>
              <Text style={styles.expertName}>Dr. Rajesh Singh</Text>
              <Text style={styles.expertTitle}>Agricultural Scientist</Text>
            </View>
          </View>
          <Text style={styles.expertQuote}>
            "For the current season in {locationName}, focus on soil moisture conservation 
            and timely application of appropriate nutrients for optimal crop health."
          </Text>
        </View>
      </View>
      
      <View style={styles.videoTipsSection}>
        <Text style={styles.sectionTitle}>Video Tips</Text>
        <View style={styles.videoCard}>
          <View style={styles.videoThumbnail}>
            <Text style={styles.playIcon}>▶️</Text>
          </View>
          <Text style={styles.videoTitle}>Natural Pest Management Techniques</Text>
          <Text style={styles.videoDuration}>5:24</Text>
        </View>
        
        <View style={styles.videoCard}>
          <View style={styles.videoThumbnail}>
            <Text style={styles.playIcon}>▶️</Text>
          </View>
          <Text style={styles.videoTitle}>Water Conservation Strategies</Text>
          <Text style={styles.videoDuration}>7:12</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 18,
    color: '#6B7280',
  },
  header: {
    backgroundColor: '#F59E0B', // amber-500
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  categorySelector: {
    flexDirection: 'row',
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeCategoryButton: {
    borderBottomWidth: 2,
    borderBottomColor: '#F59E0B', // amber-500
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeCategoryButtonText: {
    color: '#F59E0B', // amber-500
    fontWeight: 'bold',
  },
  tipsContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
    marginTop: 8,
  },
  tipCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 16,
    overflow: 'hidden',
  },
  tipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  seasonalBadge: {
    backgroundColor: '#FEF3C7', // amber-100
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 16,
  },
  cropBadge: {
    backgroundColor: '#D1FAE5', // green-100
  },
  sustainableBadge: {
    backgroundColor: '#E0F2FE', // blue-100
  },
  seasonalBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#78350F', // amber-900
  },
  tipDescription: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22,
    padding: 16,
  },
  readMoreButton: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingVertical: 12,
    alignItems: 'center',
  },
  readMoreButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#F59E0B', // amber-500
  },
  expertAdviceSection: {
    padding: 16,
  },
  expertCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    padding: 16,
  },
  expertInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  expertAvatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  expertInitials: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6B7280',
  },
  expertName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  expertTitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  expertQuote: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22,
    fontStyle: 'italic',
  },
  videoTipsSection: {
    padding: 16,
    paddingBottom: 32,
  },
  videoCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 16,
    overflow: 'hidden',
  },
  videoThumbnail: {
    height: 160,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    fontSize: 48,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    padding: 12,
  },
  videoDuration: {
    position: 'absolute',
    bottom: 168,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
}); 