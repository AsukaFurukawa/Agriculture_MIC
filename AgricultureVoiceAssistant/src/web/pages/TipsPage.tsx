import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Animated, Image, Dimensions, Platform } from 'react-native';
import { useWebAppContext } from '../contexts/WebAppContext';
import { Icon } from '../../components/Icon';

export default function TipsPage() {
  const { tipsData, language, locationName } = useWebAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedTip, setExpandedTip] = useState(null);
  
  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const translateAnim = React.useRef(new Animated.Value(30)).current;
  
  // Expanded tips data
  const [expandedTips, setExpandedTips] = useState({});
  
  // Enhanced mock tips data
  const [enhancedTipsData, setEnhancedTipsData] = useState({
    seasonal: [
      { 
        id: 's1',
        title: 'Monsoon Preparation', 
        description: 'Prepare your fields for the upcoming monsoon season by implementing proper drainage systems.', 
        fullContent: 'Before the monsoon begins, ensure all drainage channels are cleared of debris. Create contour bunds to prevent soil erosion. For crops on slopes, consider terracing to manage water flow effectively. Apply organic mulch around plants to prevent soil splashing which can spread disease during heavy rains.',
        category: 'seasonal',
        imageUrl: 'https://images.unsplash.com/photo-1560999448-1168df533bc3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
        tags: ['monsoon', 'drainage', 'preparation'],
        difficulty: 'Medium',
        timeNeeded: '2-3 days',
        bestFor: 'All crop types'
      },
      { 
        id: 's2',
        title: 'Pest Control', 
        description: 'Apply neem oil as a natural pesticide to protect crops from common seasonal pests.', 
        fullContent: 'Mix 2-3 tablespoons of neem oil with 1 liter of water and a few drops of mild liquid soap. Spray early in the morning or late evening for best results. Focus on undersides of leaves where pests often hide. Reapply every 7-14 days depending on pest pressure. This solution is effective against aphids, whiteflies, and many caterpillars while being safe for beneficial insects when dry.',
        category: 'seasonal',
        imageUrl: 'https://images.unsplash.com/photo-1534487375064-c0e7cc0bae10?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
        tags: ['pest', 'organic', 'neem'],
        difficulty: 'Easy',
        timeNeeded: '2-3 hours',
        bestFor: 'Vegetables, fruit trees'
      },
      { 
        id: 's3',
        title: 'Soil Health', 
        description: 'Add organic compost to improve soil health before the next planting season.', 
        fullContent: 'Apply well-decomposed compost at 5-10 tons per hectare. Incorporate it into the top 15cm of soil. If preparing beds, mix equal parts soil and compost. For established plants, apply a 5cm layer around the drip line without touching the stems. Compost improves water retention, adds nutrients gradually, and increases beneficial microbial activity in the soil.',
        category: 'seasonal',
        imageUrl: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
        tags: ['soil', 'compost', 'organic'],
        difficulty: 'Medium',
        timeNeeded: '1-2 days',
        bestFor: 'All crops, especially vegetables'
      },
      { 
        id: 's4',
        title: 'Summer Heat Management', 
        description: 'Implement techniques to protect crops from excessive summer heat and sun damage.', 
        fullContent: 'Create shade using shade cloth with 30-50% shade for sensitive crops. Increase irrigation frequency but with shorter durations to avoid water wastage. Apply mulch with a thickness of 5-10cm around plants to keep roots cool and conserve moisture. Water during early morning or evening to reduce evaporation loss. Consider temporary structures like bamboo frames with jute or cloth covers for extremely sensitive crops.',
        category: 'seasonal',
        imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
        tags: ['summer', 'heat', 'protection'],
        difficulty: 'Medium',
        timeNeeded: '1-3 days',
        bestFor: 'Vegetables, young fruit trees'
      }
    ],
    crops: [
      { 
        id: 'c1',
        crop: 'Wheat', 
        tip: 'Water wheat crops early in the morning for optimal results and water conservation.', 
        fullContent: 'Wheat requires approximately 450-650mm of water throughout the growing season. Critical irrigation times are at crown root initiation (20-25 days after sowing), tillering, jointing, flowering, and grain filling stages. Early morning irrigation reduces evaporation losses by up to 30% compared to midday watering. Maintain a 5-7 day irrigation interval depending on soil type and weather conditions.',
        category: 'crops',
        imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1c5a1ec15?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
        tags: ['wheat', 'irrigation', 'water conservation'],
        difficulty: 'Easy',
        timeNeeded: 'Seasonal',
        bestFor: 'All wheat varieties'
      },
      { 
        id: 'c2',
        crop: 'Rice', 
        tip: 'Maintain proper water levels in paddy fields to prevent water stress.', 
        fullContent: 'During the vegetative stage, maintain water level at 2-5cm. Increase to 5-10cm during reproductive stage. Drain the field 7-10 days before harvesting. Alternate wetting and drying can save water while maintaining yields - allow soil to dry until hairline cracks appear before re-flooding. For basmati varieties, periodic drying improves aroma development. Monitor rainfall patterns to adjust irrigation schedule accordingly.',
        category: 'crops',
        imageUrl: 'https://images.unsplash.com/photo-1536054695485-8b17b23380de?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
        tags: ['rice', 'paddy', 'water management'],
        difficulty: 'Medium',
        timeNeeded: 'Daily monitoring',
        bestFor: 'All rice varieties'
      },
      { 
        id: 'c3',
        crop: 'Cotton', 
        tip: 'Monitor for bollworms regularly and use integrated pest management techniques.', 
        fullContent: 'Install pheromone traps at 5 per hectare to monitor bollworm populations. Scout fields twice weekly by examining 20 plants in 5 random locations. Economic threshold is 10% damaged squares or 1 larva per plant. Use neem-based sprays at early infestation. For severe infestations, consult an agriculture extension officer for appropriate biopesticides or selective chemical controls. Encourage natural predators by maintaining refuge crops and avoiding broad-spectrum insecticides.',
        category: 'crops',
        imageUrl: 'https://images.unsplash.com/photo-1528498033373-3c6c08e93d79?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
        tags: ['cotton', 'pest management', 'bollworm'],
        difficulty: 'Hard',
        timeNeeded: 'Bi-weekly monitoring',
        bestFor: 'All cotton varieties'
      },
      { 
        id: 'c4',
        crop: 'Sugarcane', 
        tip: 'Implement proper trench planting for better water and nutrient efficiency.', 
        fullContent: 'Dig trenches 30cm wide and 25cm deep with 90cm between rows. Place two-budded setts in a zigzag manner. Apply farm manure or compost in the trench before planting. This technique improves water use efficiency by 20-30% and facilitates better nutrient uptake. It also makes mechanical operations between rows easier. For ratoon crops, maintain trash mulching for moisture conservation and weed suppression.',
        category: 'crops',
        imageUrl: 'https://images.unsplash.com/photo-1534531173927-aeb928d54385?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
        tags: ['sugarcane', 'planting', 'trenching'],
        difficulty: 'Medium',
        timeNeeded: 'Planting season',
        bestFor: 'Commercial sugarcane farming'
      }
    ],
    sustainable: [
      { 
        id: 'su1',
        title: 'Water Conservation', 
        description: 'Implement drip irrigation to conserve water and deliver nutrients directly to plant roots.', 
        fullContent: 'Drip irrigation can reduce water usage by 30-50% compared to conventional methods. Install main lines along field edges with sub-lines running along crop rows. Place emitters near plant roots with flow rates of 1-4 liters per hour. Connect to a filter system to prevent clogging. The initial investment costs approximately ₹45,000-60,000 per hectare but reduces labor costs and allows for precise fertilizer application (fertigation).',
        category: 'sustainable',
        imageUrl: 'https://images.unsplash.com/photo-1534620783980-fa96320b0ce6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
        tags: ['water', 'irrigation', 'efficiency'],
        difficulty: 'Hard',
        timeNeeded: '3-7 days for installation',
        bestFor: 'Vegetables, fruit trees, cash crops'
      },
      { 
        id: 'su2',
        title: 'Natural Fertilizers', 
        description: 'Use cow dung and compost as natural alternatives to chemical fertilizers.', 
        fullContent: 'Prepare compost by layering agricultural waste, cow dung, and soil in a 3:1:1 ratio. Add effective microorganisms or old compost to accelerate decomposition. Turn the pile every 15-20 days and maintain proper moisture. Well-prepared compost should be ready in 3-4 months. Apply at 5-10 tons per hectare to provide balanced nutrients, improve soil structure, and enhance water-holding capacity. Cow dung slurry (1:10 with water) can be used as a foliar spray to deter certain pests.',
        category: 'sustainable',
        imageUrl: 'https://images.unsplash.com/photo-1592971772768-86ce916c10b9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
        tags: ['fertilizer', 'organic', 'compost'],
        difficulty: 'Medium',
        timeNeeded: '3-4 months for preparation',
        bestFor: 'All crops'
      },
      { 
        id: 'su3',
        title: 'Multi-cropping Systems', 
        description: 'Implement companion planting and crop rotation to improve soil health and reduce pest pressure.', 
        fullContent: 'Grow complementary crops together such as maize+cowpea, cotton+green gram, or wheat+mustard. Follow crop rotation planning: cereals → pulses → vegetables → cereals. This disrupts pest life cycles, improves nutrient use efficiency, and reduces disease pressure. Leave 25% of land for diverse flowering plants to attract beneficial insects. Properly planned multi-cropping can increase total land productivity by 30-60% while reducing fertilizer and pesticide needs.',
        category: 'sustainable',
        imageUrl: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
        tags: ['crop rotation', 'companion planting', 'biodiversity'],
        difficulty: 'Medium',
        timeNeeded: 'Seasonal planning',
        bestFor: 'Small and medium farms'
      }
    ],
    technology: [
      { 
        id: 't1',
        title: 'Smartphone Farming Apps', 
        description: 'Utilize mobile applications to get weather updates, market prices, and farming advice.', 
        fullContent: 'Download apps like Kisan Suvidha, IFFCO Kisan, or Plantix for regular updates. These apps provide localized weather forecasts, market prices across different mandis, pest identification through photos, and expert advice. Most are available in multiple Indian languages and work with basic smartphones. Some apps also connect farmers directly to buyers, eliminating middlemen and potentially increasing profits by 10-15%.',
        category: 'technology',
        imageUrl: 'https://images.unsplash.com/photo-1522159698025-071104a1ddbd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
        tags: ['apps', 'digital', 'smartphone'],
        difficulty: 'Easy',
        timeNeeded: '1 hour to set up',
        bestFor: 'All farmers with smartphones'
      },
      { 
        id: 't2',
        title: 'Low-cost Soil Testing', 
        description: 'Use affordable soil testing kits to monitor nutrient levels and pH.', 
        fullContent: 'Purchase soil testing kits available from Krishi Vigyan Kendras for ₹200-500. Take samples from 5-10 locations in your field at 15cm depth, mix thoroughly, and follow kit instructions. Tests typically measure N, P, K levels and pH. Results help determine exact fertilizer requirements, potentially reducing fertilizer costs by 20-30%. For more detailed analysis, send samples to government soil testing laboratories (nominal fee of ₹50-100) for comprehensive reports including micronutrients.',
        category: 'technology',
        imageUrl: 'https://images.unsplash.com/photo-1563299796-17596ed6b017?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
        tags: ['soil testing', 'nutrients', 'analysis'],
        difficulty: 'Medium',
        timeNeeded: '1-2 hours',
        bestFor: 'All farm types'
      }
    ]
  });
  
  // Run animations on component mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.timing(translateAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: Platform.OS !== 'web',
      }),
    ]).start();
  }, [fadeAnim, translateAnim]);
  
  // Filter tips based on search query and active category
  const getFilteredTips = () => {
    let allTips = [];
    
    // Combine all tips into a single array
    Object.keys(enhancedTipsData).forEach(category => {
      const tipsWithCategory = enhancedTipsData[category].map(tip => ({
        ...tip,
        category
      }));
      allTips = [...allTips, ...tipsWithCategory];
    });
    
    // Filter by search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      allTips = allTips.filter(tip => {
        const titleMatch = tip.title ? tip.title.toLowerCase().includes(query) : false;
        const cropMatch = tip.crop ? tip.crop.toLowerCase().includes(query) : false;
        const descMatch = tip.description.toLowerCase().includes(query);
        const tagMatch = tip.tags ? tip.tags.some(tag => tag.toLowerCase().includes(query)) : false;
        
        return titleMatch || cropMatch || descMatch || tagMatch;
      });
    }
    
    // Filter by active category
    if (activeCategory !== 'all') {
      allTips = allTips.filter(tip => tip.category === activeCategory);
    }
    
    return allTips;
  };
  
  // Toggle the expanded state of a tip
  const toggleTipExpanded = (tipId) => {
    setExpandedTips(prev => ({
      ...prev,
      [tipId]: !prev[tipId]
    }));
  };
  
  // Translate text based on selected language
  const translate = (text) => {
    // In a real app, this would use a translation service
    // For now, we'll just return the English text
    return text;
  };
  
  // Get category color
  const getCategoryColor = (category) => {
    const colors = {
      seasonal: '#3B82F6', // blue
      crops: '#10B981',    // emerald
      sustainable: '#F59E0B', // amber
      technology: '#8B5CF6'  // purple
    };
    
    return colors[category] || '#6B7280'; // default to gray
  };
  
  // Get category icon
  const getCategoryIcon = (category) => {
    const icons = {
      seasonal: 'calendar',
      crops: 'sprout',
      sustainable: 'leaf',
      technology: 'cellphone'
    };
    
    return icons[category] || 'information';
  };
  
  const filteredTips = getFilteredTips();
  
  return (
    <ScrollView style={styles.container}>
      {/* Header section with search */}
      <Animated.View 
        style={[
          styles.headerSection,
          {
            opacity: fadeAnim,
            transform: [{ translateY: translateAnim }]
          }
        ]}
      >
        <Text style={styles.pageTitle}>{translate('Farming Tips')}</Text>
        <Text style={styles.pageSubtitle}>
          {translate('Expert advice tailored for farmers in')} {locationName}
        </Text>
        
        <View style={styles.searchContainer}>
          <Icon name="magnify" size={20} color="#6B7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={translate("Search for farming tips...")}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={() => setSearchQuery('')}
            >
              <Icon name="close-circle" size={20} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
      
      {/* Category tabs */}
      <Animated.View 
        style={[
          styles.categoryTabsContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: translateAnim }]
          }
        ]}
      >
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryTabs}
        >
          <TouchableOpacity 
            style={[
              styles.categoryTab, 
              activeCategory === 'all' && styles.activeCategoryTab
            ]}
            onPress={() => setActiveCategory('all')}
          >
            <Icon 
              name="format-list-bulleted" 
              size={18} 
              color={activeCategory === 'all' ? 'white' : '#4B5563'} 
            />
            <Text 
              style={[
                styles.categoryTabText,
                activeCategory === 'all' && styles.activeCategoryTabText
              ]}
            >
              {translate('All Tips')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.categoryTab, 
              activeCategory === 'seasonal' && styles.activeCategoryTab,
              activeCategory === 'seasonal' && { backgroundColor: getCategoryColor('seasonal') }
            ]}
            onPress={() => setActiveCategory('seasonal')}
          >
            <Icon 
              name="calendar" 
              size={18} 
              color={activeCategory === 'seasonal' ? 'white' : '#4B5563'} 
            />
            <Text 
              style={[
                styles.categoryTabText,
                activeCategory === 'seasonal' && styles.activeCategoryTabText
              ]}
            >
              {translate('Seasonal')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.categoryTab, 
              activeCategory === 'crops' && styles.activeCategoryTab,
              activeCategory === 'crops' && { backgroundColor: getCategoryColor('crops') }
            ]}
            onPress={() => setActiveCategory('crops')}
          >
            <Icon 
              name="sprout" 
              size={18} 
              color={activeCategory === 'crops' ? 'white' : '#4B5563'} 
            />
            <Text 
              style={[
                styles.categoryTabText,
                activeCategory === 'crops' && styles.activeCategoryTabText
              ]}
            >
              {translate('Crop-Specific')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.categoryTab, 
              activeCategory === 'sustainable' && styles.activeCategoryTab,
              activeCategory === 'sustainable' && { backgroundColor: getCategoryColor('sustainable') }
            ]}
            onPress={() => setActiveCategory('sustainable')}
          >
            <Icon 
              name="leaf" 
              size={18} 
              color={activeCategory === 'sustainable' ? 'white' : '#4B5563'} 
            />
            <Text 
              style={[
                styles.categoryTabText,
                activeCategory === 'sustainable' && styles.activeCategoryTabText
              ]}
            >
              {translate('Sustainable')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.categoryTab, 
              activeCategory === 'technology' && styles.activeCategoryTab,
              activeCategory === 'technology' && { backgroundColor: getCategoryColor('technology') }
            ]}
            onPress={() => setActiveCategory('technology')}
          >
            <Icon 
              name="cellphone" 
              size={18} 
              color={activeCategory === 'technology' ? 'white' : '#4B5563'} 
            />
            <Text 
              style={[
                styles.categoryTabText,
                activeCategory === 'technology' && styles.activeCategoryTabText
              ]}
            >
              {translate('Technology')}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
      
      {/* Results count */}
      <Animated.View
        style={[
          styles.resultsCountContainer,
          {
            opacity: fadeAnim
          }
        ]}
      >
        <Text style={styles.resultsCountText}>
          {filteredTips.length} {translate(filteredTips.length === 1 ? 'tip found' : 'tips found')}
        </Text>
      </Animated.View>
      
      {/* Tips list */}
      <Animated.View
        style={[
          styles.tipsContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: translateAnim }]
          }
        ]}
      >
        {filteredTips.length === 0 ? (
          <View style={styles.noResultsContainer}>
            <Icon name="alert-circle-outline" size={48} color="#9CA3AF" />
            <Text style={styles.noResultsText}>
              {translate('No tips found matching your search')}
            </Text>
            <TouchableOpacity 
              style={styles.resetButton}
              onPress={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
            >
              <Text style={styles.resetButtonText}>{translate('Reset Filters')}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredTips.map((tip, index) => (
            <TouchableOpacity
              key={tip.id || index}
              style={[
                styles.tipCard,
                { borderLeftColor: getCategoryColor(tip.category) }
              ]}
              onPress={() => toggleTipExpanded(tip.id)}
            >
              <View style={styles.tipCardHeader}>
                <View style={styles.tipCardHeaderContent}>
                  <View style={[
                    styles.categoryBadge,
                    { backgroundColor: getCategoryColor(tip.category) }
                  ]}>
                    <Icon 
                      name={getCategoryIcon(tip.category)} 
                      size={14} 
                      color="white" 
                    />
                    <Text style={styles.categoryBadgeText}>
                      {translate(tip.category.charAt(0).toUpperCase() + tip.category.slice(1))}
                    </Text>
                  </View>
                  
                  <Text style={styles.tipTitle}>
                    {tip.title || (tip.crop ? `${tip.crop} Tip` : 'Farming Tip')}
                  </Text>
                </View>
                
                <Icon 
                  name={expandedTips[tip.id] ? 'chevron-up' : 'chevron-down'} 
                  size={24} 
                  color="#6B7280" 
                />
              </View>
              
              {tip.imageUrl && (
                <Image 
                  source={{ uri: tip.imageUrl }} 
                  style={styles.tipImage}
                  resizeMode="cover"
                />
              )}
              
              <Text style={styles.tipDescription}>
                {tip.description}
              </Text>
              
              {expandedTips[tip.id] && (
                <View style={styles.expandedContent}>
                  <View style={styles.divider} />
                  
                  <Text style={styles.expandedText}>
                    {tip.fullContent}
                  </Text>
                  
                  {tip.tags && (
                    <View style={styles.tagsContainer}>
                      {tip.tags.map((tag, tagIndex) => (
                        <View key={tagIndex} style={styles.tag}>
                          <Text style={styles.tagText}>#{tag}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                  
                  <View style={styles.metadataContainer}>
                    {tip.difficulty && (
                      <View style={styles.metadataItem}>
                        <Icon name="alert-circle-outline" size={16} color="#6B7280" />
                        <Text style={styles.metadataText}>
                          {translate('Difficulty')}: {translate(tip.difficulty)}
                        </Text>
                      </View>
                    )}
                    
                    {tip.timeNeeded && (
                      <View style={styles.metadataItem}>
                        <Icon name="clock-outline" size={16} color="#6B7280" />
                        <Text style={styles.metadataText}>
                          {translate('Time')}: {tip.timeNeeded}
                        </Text>
                      </View>
                    )}
                    
                    {tip.bestFor && (
                      <View style={styles.metadataItem}>
                        <Icon name="check-circle-outline" size={16} color="#6B7280" />
                        <Text style={styles.metadataText}>
                          {translate('Best for')}: {tip.bestFor}
                        </Text>
                      </View>
                    )}
                  </View>
                  
                  <TouchableOpacity style={styles.shareButton}>
                    <Icon name="share-variant" size={16} color="#3B82F6" />
                    <Text style={styles.shareButtonText}>
                      {translate('Share this tip')}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </TouchableOpacity>
          ))
        )}
      </Animated.View>
      
      {/* Disclaimer section */}
      <View style={styles.disclaimerContainer}>
        <Text style={styles.disclaimerText}>
          {translate('These tips are general guidance. Always consider your specific local conditions and consult with local agricultural experts when applicable.')}
        </Text>
      </View>
    </ScrollView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  headerSection: {
    backgroundColor: 'white',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  pageSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    paddingVertical: 4,
  },
  clearButton: {
    padding: 4,
  },
  categoryTabsContainer: {
    backgroundColor: 'white',
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 10,
  },
  categoryTabs: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    gap: 8,
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    marginRight: 8,
  },
  activeCategoryTab: {
    backgroundColor: '#3B82F6',
  },
  categoryTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
    marginLeft: 6,
  },
  activeCategoryTabText: {
    color: 'white',
  },
  resultsCountContainer: {
    padding: 16,
    backgroundColor: '#F9FAFB',
  },
  resultsCountText: {
    fontSize: 14,
    color: '#6B7280',
  },
  tipsContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  noResultsText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  resetButton: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3B82F6',
  },
  tipCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  tipCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  tipCardHeaderContent: {
    flex: 1,
    marginRight: 16,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: 'white',
    marginLeft: 4,
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  tipImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#E5E7EB',
  },
  tipDescription: {
    fontSize: 16,
    color: '#4B5563',
    padding: 16,
    paddingTop: 0,
    lineHeight: 22,
  },
  expandedContent: {
    padding: 16,
    paddingTop: 0,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 16,
  },
  expandedText: {
    fontSize: 16,
    color: '#1F2937',
    lineHeight: 24,
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 8,
  },
  tag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 14,
    color: '#4B5563',
  },
  metadataContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metadataText: {
    fontSize: 14,
    color: '#4B5563',
    marginLeft: 8,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
    paddingVertical: 10,
    borderRadius: 8,
  },
  shareButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3B82F6',
    marginLeft: 8,
  },
  disclaimerContainer: {
    padding: 16,
    marginBottom: 16,
  },
  disclaimerText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    fontStyle: 'italic',
  },
}); 