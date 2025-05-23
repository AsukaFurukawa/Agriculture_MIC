import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useWebAppContext } from '../contexts/WebAppContext';
import { Icon } from '../../components/Icon';
import SchemeDetailsModal from '../components/SchemeDetailsModal';

export default function SchemesPage() {
  const { language, locationName } = useWebAppContext();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [schemes, setSchemes] = useState([]);
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  // Mock schemes data
  const mockSchemes = [
    {
      id: 1,
      name: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
      description: 'Financial support of ₹6,000 per year to all landholding farmer families in three equal installments.',
      eligibility: 'All landholding farmers with cultivable land.',
      benefits: '₹6,000 per year in three equal installments.',
      category: 'financial',
      contactHelpline: '011-23381092',
      website: 'https://pmkisan.gov.in/',
      documentationRequired: 'Aadhaar Card, Land Records, Bank Account Details',
    },
    {
      id: 2,
      name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
      description: 'Crop insurance scheme to provide financial support to farmers suffering crop loss or damage due to unforeseen events.',
      eligibility: 'All farmers growing notified crops in notified areas.',
      benefits: 'Insurance coverage and financial support in case of crop failure due to natural calamities, pests & diseases.',
      category: 'insurance',
      contactHelpline: '011-23388837',
      website: 'https://pmfby.gov.in/',
      documentationRequired: 'Aadhaar Card, Land Records, Bank Account Details, Crop Sowing Certificate',
    },
    {
      id: 3,
      name: 'Kisan Credit Card (KCC)',
      description: 'Provides farmers with affordable credit for their agricultural needs.',
      eligibility: 'All farmers, sharecroppers, tenant farmers, and self-help groups.',
      benefits: 'Credit up to ₹3 lakh at 4% interest rate (with prompt repayment incentive).',
      category: 'credit',
      contactHelpline: 'Contact your nearest bank branch',
      website: 'https://www.nabard.org/content.aspx?id=513',
      documentationRequired: 'Aadhaar Card, Land Records, Photo, Bank Account Details',
    },
    {
      id: 4,
      name: 'Soil Health Card Scheme',
      description: 'Provides information on soil health to farmers to help them improve productivity through judicious use of inputs.',
      eligibility: 'All farmers',
      benefits: 'Free soil testing and recommendations for nutrients and fertilizers.',
      category: 'education',
      contactHelpline: '011-23382444',
      website: 'https://soilhealth.dac.gov.in/',
      documentationRequired: 'Aadhaar Card, Land Location Details',
    },
    {
      id: 5,
      name: 'PM Krishi Sinchai Yojana',
      description: 'Aims to ensure access to irrigation to all agricultural farms to produce "per drop more crop".',
      eligibility: 'Farmers needing irrigation facilities, especially small and marginal farmers.',
      benefits: 'Subsidies for micro-irrigation systems like drip and sprinkler irrigation.',
      category: 'infrastructure',
      contactHelpline: '011-23389146',
      website: 'https://pmksy.gov.in/',
      documentationRequired: 'Aadhaar Card, Land Records, Bank Account Details, Estimate for Irrigation System',
    },
    {
      id: 6,
      name: 'National Mission for Sustainable Agriculture (NMSA)',
      description: 'Promotes sustainable agriculture through climate change adaptation, water conservation, and soil management.',
      eligibility: 'All farmers willing to adopt sustainable agriculture practices.',
      benefits: 'Financial assistance for adopting sustainable agricultural practices.',
      category: 'education',
      contactHelpline: '011-23382651',
      website: 'https://nmsa.dac.gov.in/',
      documentationRequired: 'Aadhaar Card, Land Records, Bank Account Details',
    },
    {
      id: 7,
      name: 'Sub-Mission on Agricultural Mechanization (SMAM)',
      description: 'Promotes farm mechanization to improve crop productivity.',
      eligibility: 'Individual farmers, Self-help groups, cooperatives, registered farmer societies.',
      benefits: 'Subsidies up to 50% on purchase of agricultural machinery and equipment.',
      category: 'infrastructure',
      contactHelpline: '011-23382436',
      website: 'https://farmech.dac.gov.in/',
      documentationRequired: 'Aadhaar Card, Land Records, Bank Account Details, Quotation for Machinery',
    },
  ];
  
  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setSchemes(mockSchemes);
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Handle scheme selection and modal display
  const handleSchemePress = (scheme) => {
    setSelectedScheme(scheme);
    setModalVisible(true);
  };
  
  // Handle scheme application
  const handleApplyPress = (scheme) => {
    setSelectedScheme(scheme);
    setModalVisible(true);
  };
  
  // Translate text based on selected language
  const translate = (text) => {
    // This would be replaced with actual translations
    if (language === 'Hindi') {
      const translations = {
        'Search schemes...': 'योजनाएं खोजें...',
        'All Schemes': 'सभी योजनाएं',
        'Financial': 'वित्तीय',
        'Insurance': 'बीमा',
        'Credit': 'ऋण',
        'Education': 'शिक्षा',
        'Infrastructure': 'बुनियादी ढांचा',
        'Eligibility:': 'पात्रता:',
        'Benefits:': 'लाभ:',
        'Helpline:': 'हेल्पलाइन:',
        'Website:': 'वेबसाइट:',
        'Required Documents:': 'आवश्यक दस्तावेज:',
        'How to Apply': 'आवेदन कैसे करें',
        'Need Help?': 'मदद चाहिए?',
        'Government Schemes': 'सरकारी योजनाएं',
        'No schemes found matching your search criteria.': 'आपके खोज मापदंड से मेल खाती कोई योजना नहीं मिली।',
        'Our experts can guide you through the application process for any government scheme.': 'हमारे विशेषज्ञ आपको किसी भी सरकारी योजना के आवेदन प्रक्रिया में मार्गदर्शन कर सकते हैं।',
        'Call our toll-free number:': 'हमारे टोल-फ्री नंबर पर कॉल करें:',
        'Contact an Expert': 'विशेषज्ञ से संपर्क करें',
      };
      return translations[text] || text;
    }
    return text;
  };
  
  // Filter schemes based on search query and category filter
  const filteredSchemes = schemes.filter(scheme => {
    const matchesSearch = scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          scheme.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || scheme.category === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });
  
  const getCategoryName = (category) => {
    switch(category) {
      case 'financial': return 'Financial Support';
      case 'insurance': return 'Insurance';
      case 'credit': return 'Credit & Loans';
      case 'education': return 'Education & Training';
      case 'infrastructure': return 'Infrastructure & Equipment';
      default: return category.charAt(0).toUpperCase() + category.slice(1);
    }
  };
  
  const getCategoryColor = (category) => {
    switch(category) {
      case 'financial': return '#3B82F6'; // blue
      case 'insurance': return '#10B981'; // green
      case 'credit': return '#F59E0B'; // amber
      case 'education': return '#8B5CF6'; // purple
      case 'infrastructure': return '#EF4444'; // red
      default: return '#6B7280'; // gray
    }
  };
  
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading government schemes...</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.mainContainer}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{translate('Government Schemes')}</Text>
          <Text style={styles.headerSubtitle}>{locationName}</Text>
        </View>
        
        <View style={styles.searchBarContainer}>
          <View style={styles.searchInputContainer}>
            <Icon name="magnify" size={20} color="#6B7280" style={styles.searchIcon} />
            <TextInput
              style={styles.searchBar}
              placeholder={translate('Search schemes...')}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
                <Icon name="close-circle" size={18} color="#6B7280" />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
          <TouchableOpacity 
            style={[styles.filterButton, selectedFilter === 'all' && styles.activeFilterButton]}
            onPress={() => setSelectedFilter('all')}
          >
            <Text style={[styles.filterButtonText, selectedFilter === 'all' && styles.activeFilterButtonText]}>
              {translate('All Schemes')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.filterButton, selectedFilter === 'financial' && styles.activeFilterButton, {borderColor: getCategoryColor('financial')}]}
            onPress={() => setSelectedFilter('financial')}
          >
            <Text style={[styles.filterButtonText, selectedFilter === 'financial' && styles.activeFilterButtonText, {color: getCategoryColor('financial')}]}>
              {translate('Financial')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.filterButton, selectedFilter === 'insurance' && styles.activeFilterButton, {borderColor: getCategoryColor('insurance')}]}
            onPress={() => setSelectedFilter('insurance')}
          >
            <Text style={[styles.filterButtonText, selectedFilter === 'insurance' && styles.activeFilterButtonText, {color: getCategoryColor('insurance')}]}>
              {translate('Insurance')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.filterButton, selectedFilter === 'credit' && styles.activeFilterButton, {borderColor: getCategoryColor('credit')}]}
            onPress={() => setSelectedFilter('credit')}
          >
            <Text style={[styles.filterButtonText, selectedFilter === 'credit' && styles.activeFilterButtonText, {color: getCategoryColor('credit')}]}>
              {translate('Credit')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.filterButton, selectedFilter === 'education' && styles.activeFilterButton, {borderColor: getCategoryColor('education')}]}
            onPress={() => setSelectedFilter('education')}
          >
            <Text style={[styles.filterButtonText, selectedFilter === 'education' && styles.activeFilterButtonText, {color: getCategoryColor('education')}]}>
              {translate('Education')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.filterButton, selectedFilter === 'infrastructure' && styles.activeFilterButton, {borderColor: getCategoryColor('infrastructure')}]}
            onPress={() => setSelectedFilter('infrastructure')}
          >
            <Text style={[styles.filterButtonText, selectedFilter === 'infrastructure' && styles.activeFilterButtonText, {color: getCategoryColor('infrastructure')}]}>
              {translate('Infrastructure')}
            </Text>
          </TouchableOpacity>
        </ScrollView>
        
        <View style={styles.schemesContainer}>
          {filteredSchemes.length > 0 ? (
            filteredSchemes.map((scheme) => (
              <TouchableOpacity 
                key={scheme.id} 
                style={styles.schemeCard}
                onPress={() => handleSchemePress(scheme)}
                activeOpacity={0.8}
              >
                <View style={[styles.schemeCategory, {backgroundColor: getCategoryColor(scheme.category)}]}>
                  <Text style={styles.schemeCategoryText}>{getCategoryName(scheme.category)}</Text>
                </View>
                
                <Text style={styles.schemeName}>{scheme.name}</Text>
                <Text style={styles.schemeDescription}>{scheme.description}</Text>
                
                <View style={styles.schemeMeta}>
                  <Text style={styles.schemeMetaLabel}>{translate('Eligibility:')}</Text>
                  <Text style={styles.schemeMetaValue}>{scheme.eligibility}</Text>
                </View>
                
                <View style={styles.schemeMeta}>
                  <Text style={styles.schemeMetaLabel}>{translate('Benefits:')}</Text>
                  <Text style={styles.schemeMetaValue}>{scheme.benefits}</Text>
                </View>
                
                <View style={styles.contactSection}>
                  <View style={styles.contactItem}>
                    <Text style={styles.contactLabel}>{translate('Helpline:')}</Text>
                    <Text style={styles.contactValue}>{scheme.contactHelpline}</Text>
                  </View>
                  <View style={styles.contactItem}>
                    <Text style={styles.contactLabel}>{translate('Website:')}</Text>
                    <Text style={styles.contactValue}>{scheme.website}</Text>
                  </View>
                </View>
                
                <View style={styles.docSection}>
                  <Text style={styles.docSectionTitle}>{translate('Required Documents:')}</Text>
                  <Text style={styles.docSectionText}>{scheme.documentationRequired}</Text>
                </View>
                
                <TouchableOpacity 
                  style={styles.applyButton}
                  onPress={() => handleApplyPress(scheme)}
                >
                  <Text style={styles.applyButtonText}>{translate('How to Apply')}</Text>
                  <Icon name="arrow-right" size={16} color="#8B5CF6" style={styles.applyIcon} />
                </TouchableOpacity>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.noResultsContainer}>
              <Icon name="file-search-outline" size={48} color="#D1D5DB" style={styles.noResultsIcon} />
              <Text style={styles.noResultsText}>{translate('No schemes found matching your search criteria.')}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.helpSection}>
          <Text style={styles.helpSectionTitle}>{translate('Need Help?')}</Text>
          <Text style={styles.helpSectionText}>
            {translate('Our experts can guide you through the application process for any government scheme.')}
            {'\n'}{translate('Call our toll-free number:')} <Text style={styles.boldText}>1800-180-1551</Text>
          </Text>
          <TouchableOpacity style={styles.helpButton}>
            <Icon name="phone" size={20} color="white" style={styles.helpButtonIcon} />
            <Text style={styles.helpButtonText}>{translate('Contact an Expert')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      {/* Scheme details modal */}
      <SchemeDetailsModal 
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        scheme={selectedScheme}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
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
    backgroundColor: '#8B5CF6', // purple-500
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
  searchBarContainer: {
    padding: 16,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchBar: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  clearButton: {
    padding: 4,
  },
  filtersContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  filterButton: {
    marginRight: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activeFilterButton: {
    backgroundColor: '#F9FAFB',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeFilterButtonText: {
    fontWeight: 'bold',
  },
  schemesContainer: {
    padding: 16,
  },
  schemeCard: {
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
  schemeCategory: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  schemeCategoryText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  schemeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    padding: 16,
    paddingBottom: 8,
  },
  schemeDescription: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22,
    padding: 16,
    paddingTop: 0,
    paddingBottom: 8,
  },
  schemeMeta: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  schemeMetaLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  schemeMetaValue: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  contactSection: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  contactItem: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  docSection: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  docSectionTitle: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  docSectionText: {
    fontSize: 14,
    color: '#4B5563',
  },
  applyButton: {
    padding: 16,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8B5CF6',
  },
  applyIcon: {
    marginLeft: 4,
  },
  noResultsContainer: {
    padding: 20,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 16,
    color: '#6B7280',
  },
  noResultsIcon: {
    marginBottom: 16,
  },
  helpSection: {
    margin: 16,
    marginTop: 0,
    marginBottom: 32,
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    padding: 16,
  },
  helpSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  helpSectionText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22,
    marginBottom: 16,
  },
  boldText: {
    fontWeight: 'bold',
  },
  helpButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  helpButtonIcon: {
    marginRight: 8,
  },
  helpButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
}); 