import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useWebAppContext } from '../contexts/WebAppContext';
import { Icon } from '../../components/Icon';
import { 
  predictProfitableCrops, 
  predictMarketTrends, 
  predictWeatherImpact,
  CropPrediction,
  MarketPrediction,
  WeatherImpactPrediction
} from '../services/predictiveService';

export default function PredictionsPage() {
  const { locationName } = useWebAppContext();
  const [loading, setLoading] = useState(true);
  const [landSize, setLandSize] = useState('');
  const [soilType, setSoilType] = useState('');
  const [irrigationAvailable, setIrrigationAvailable] = useState(true);
  
  // Prediction data states
  const [cropPredictions, setCropPredictions] = useState<CropPrediction[]>([]);
  const [marketPredictions, setMarketPredictions] = useState<MarketPrediction[]>([]);
  const [weatherImpacts, setWeatherImpacts] = useState<WeatherImpactPrediction[]>([]);
  
  // Selected crop for detailed view
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null);
  
  // Mock location coordinates (in real app, get from geolocation)
  const mockLatitude = 28.6139;
  const mockLongitude = 77.2090;
  
  useEffect(() => {
    loadPredictions();
  }, []);
  
  const loadPredictions = async () => {
    setLoading(true);
    
    try {
      // Basic prediction parameters
      const params = {
        latitude: mockLatitude,
        longitude: mockLongitude,
        location: locationName || 'Delhi, Delhi',
        landSizeAcres: landSize ? parseFloat(landSize) : undefined,
        soilType: soilType || undefined,
        irrigationAvailable: irrigationAvailable
      };
      
      // Get crop predictions
      const crops = await predictProfitableCrops(params);
      setCropPredictions(crops);
      
      if (crops.length > 0) {
        const cropNames = crops.map(crop => crop.cropName);
        
        // Get market predictions for the top crops
        const marketData = await predictMarketTrends(cropNames, params);
        setMarketPredictions(marketData);
        
        // Get weather impact predictions for the top crops
        const weatherData = await predictWeatherImpact(cropNames, params);
        setWeatherImpacts(weatherData);
        
        // Set the first crop as selected by default
        setSelectedCrop(crops[0].cropName);
      }
    } catch (error) {
      console.error('Error loading predictions:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCropSelect = (cropName: string) => {
    setSelectedCrop(cropName);
  };
  
  const getSelectedCropDetails = () => {
    if (!selectedCrop) return null;
    
    const crop = cropPredictions.find(c => c.cropName === selectedCrop);
    const market = marketPredictions.find(m => m.cropName === selectedCrop);
    const weather = weatherImpacts.find(w => w.cropName === selectedCrop);
    
    return { crop, market, weather };
  };
  
  const formatIndianRupees = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  const refreshPredictions = () => {
    loadPredictions();
  };
  
  const selectedDetails = getSelectedCropDetails();
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Analyzing data and generating predictions...</Text>
      </View>
    );
  }
  
  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerSection}>
        <Text style={styles.pageTitle}>Crop Profitability Predictions</Text>
        <Text style={styles.locationText}>
          <Icon name="map-marker" size={16} color="#6B7280" />
          {' '}{locationName || 'Your Location'}
        </Text>
        
        {/* Filter inputs */}
        <View style={styles.filtersContainer}>
          <View style={styles.filterItem}>
            <Text style={styles.filterLabel}>Land Size (acres)</Text>
            <TextInput
              style={styles.filterInput}
              value={landSize}
              onChangeText={setLandSize}
              placeholder="e.g. 5"
              keyboardType="numeric"
            />
          </View>
          
          <View style={styles.filterItem}>
            <Text style={styles.filterLabel}>Soil Type</Text>
            <TextInput
              style={styles.filterInput}
              value={soilType}
              onChangeText={setSoilType}
              placeholder="e.g. Clay, Loam"
            />
          </View>
        </View>
        
        <View style={styles.filterItem}>
          <Text style={styles.filterLabel}>Irrigation</Text>
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                irrigationAvailable && styles.toggleButtonActive
              ]}
              onPress={() => setIrrigationAvailable(true)}
            >
              <Text style={irrigationAvailable ? styles.toggleTextActive : styles.toggleText}>
                Available
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.toggleButton,
                !irrigationAvailable && styles.toggleButtonActive
              ]}
              onPress={() => setIrrigationAvailable(false)}
            >
              <Text style={!irrigationAvailable ? styles.toggleTextActive : styles.toggleText}>
                Unavailable
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.updateButton}
          onPress={refreshPredictions}
        >
          <Icon name="refresh" size={18} color="white" />
          <Text style={styles.updateButtonText}>Update Predictions</Text>
        </TouchableOpacity>
      </View>
      
      {/* Crops List Section */}
      {cropPredictions.length > 0 ? (
        <>
          <View style={styles.cropsSection}>
            <Text style={styles.sectionTitle}>Recommended Crops</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.cropsScrollView}
            >
              {cropPredictions.map((crop) => (
                <TouchableOpacity
                  key={crop.key}
                  style={[
                    styles.cropCard,
                    selectedCrop === crop.cropName && styles.selectedCropCard
                  ]}
                  onPress={() => handleCropSelect(crop.cropName)}
                >
                  <View style={styles.cropScoreContainer}>
                    <Text style={styles.cropScore}>{Math.round(crop.suitabilityScore)}</Text>
                    <Text style={styles.cropScoreLabel}>Score</Text>
                  </View>
                  <Text style={styles.cropName}>{crop.cropName}</Text>
                  <Text style={styles.cropProfit}>
                    {formatIndianRupees(crop.estimatedProfitPerAcre)}/acre
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
      
          {/* Selected Crop Details */}
          {selectedDetails?.crop && (
            <View style={styles.detailsSection}>
              <Text style={styles.detailsTitle}>{selectedDetails.crop.cropName} Details</Text>
              
              {/* Financial & Growth Details */}
              <View style={styles.detailsCard}>
                <Text style={styles.detailsCardTitle}>Financial & Growth</Text>
                
                <View style={styles.detailsRow}>
                  <View style={styles.detailItem}>
                    <Icon name="cash-multiple" size={20} color="#10B981" />
                    <Text style={styles.detailItemLabel}>Est. Profit</Text>
                    <Text style={styles.detailItemValue}>
                      {formatIndianRupees(selectedDetails.crop.estimatedProfitPerAcre)}/acre
                    </Text>
                  </View>
                  
                  <View style={styles.detailItem}>
                    <Icon name="trending-up" size={20} color="#3B82F6" />
                    <Text style={styles.detailItemLabel}>Est. Yield</Text>
                    <Text style={styles.detailItemValue}>
                      {selectedDetails.crop.estimatedYieldPerAcre} quintals/acre
                    </Text>
                  </View>
                </View>
                
                <View style={styles.detailsRow}>
                  <View style={styles.detailItem}>
                    <Icon name="water" size={20} color="#60A5FA" />
                    <Text style={styles.detailItemLabel}>Water Needs</Text>
                    <Text style={styles.detailItemValue}>
                      {selectedDetails.crop.waterRequirements}
                    </Text>
                  </View>
                  
                  <View style={styles.detailItem}>
                    <Icon name="calendar-range" size={20} color="#8B5CF6" />
                    <Text style={styles.detailItemLabel}>Growth Period</Text>
                    <Text style={styles.detailItemValue}>
                      {selectedDetails.crop.growthDurationDays} days
                    </Text>
                  </View>
                </View>
                
                <View style={styles.detailsList}>
                  <View style={styles.detailsListItem}>
                    <Text style={styles.detailsListText}>
                      <Text style={styles.detailsListLabel}>Market Outlook: </Text>
                      {selectedDetails.crop.marketOutlook}
                    </Text>
                  </View>
                  
                  <View style={styles.detailsListItem}>
                    <Text style={styles.detailsListText}>
                      <Text style={styles.detailsListLabel}>Weather Compatibility: </Text>
                      {selectedDetails.crop.weatherCompatibility}
                    </Text>
                  </View>
                  
                  <View style={styles.detailsListItem}>
                    <Text style={styles.detailsListText}>
                      <Text style={styles.detailsListLabel}>Investment Required: </Text>
                      {formatIndianRupees(selectedDetails.crop.estimatedCostPerAcre)}/acre
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        </>
      ) : (
        <View style={styles.emptyStateContainer}>
          <Icon name="information-outline" size={48} color="#9CA3AF" />
          <Text style={styles.emptyStateText}>
            Enter your land details and tap 'Update Predictions' to get crop recommendations
          </Text>
        </View>
      )}
      
      {/* Disclaimer */}
      <View style={styles.disclaimerContainer}>
        <Text style={styles.disclaimerText}>
          These predictions are based on available data and AI analysis. Actual results may vary based on specific local conditions and farming practices. Always consult with local agricultural experts before making major decisions.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F9FAFB',
    minHeight: 400,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
  },
  headerSection: {
    backgroundColor: 'white',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
  },
  filtersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 12,
  },
  filterItem: {
    flex: 1,
    minWidth: 150,
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 8,
  },
  filterInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 10,
    color: '#1F2937',
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    overflow: 'hidden',
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: '#3B82F6',
  },
  toggleText: {
    color: '#4B5563',
    fontSize: 14,
  },
  toggleTextActive: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  updateButton: {
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  updateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: 'white',
    margin: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minHeight: 300,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 16,
    maxWidth: 300,
    lineHeight: 24,
  },
  cropsSection: {
    paddingVertical: 24,
    backgroundColor: 'white',
    marginTop: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  cropsScrollView: {
    paddingLeft: 24,
  },
  cropCard: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    marginRight: 16,
    width: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedCropCard: {
    backgroundColor: '#EFF6FF',
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  cropScoreContainer: {
    backgroundColor: 'white',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cropScore: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  cropScoreLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  cropName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  cropProfit: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '500',
  },
  detailsSection: {
    padding: 24,
  },
  detailsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  detailsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  detailsCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  detailsRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  detailItem: {
    flex: 1,
    alignItems: 'center',
  },
  detailItemLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    marginBottom: 4,
  },
  detailItemValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  detailsList: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 16,
  },
  detailsListItem: {
    marginBottom: 12,
  },
  detailsListLabel: {
    fontWeight: '500',
    color: '#4B5563',
  },
  detailsListText: {
    fontSize: 14,
    color: '#4B5563',
    flex: 1,
  },
  disclaimerContainer: {
    padding: 24,
    paddingTop: 0,
  },
  disclaimerText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic',
    textAlign: 'center',
  },
}); 