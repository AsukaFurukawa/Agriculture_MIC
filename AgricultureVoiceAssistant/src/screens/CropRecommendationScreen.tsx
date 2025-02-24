import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Animated } from 'react-native';
import { Header } from '../components/Header';
import { colors } from '../theme/colors';

interface CropSuggestion {
  cropName: string;
  profit: number;
  investment: number;
  duration: number;
  risk: 'LOW' | 'MEDIUM' | 'HIGH';
  confidence: number;
  reasons: string[];
}

export const CropRecommendationScreen = () => {
  const [landSize, setLandSize] = useState<number>(0);
  const [suggestions, setSuggestions] = useState<CropSuggestion[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const getVoiceScript = () => {
    if (suggestions.length > 0) {
      const bestCrop = suggestions[0];
      return `${bestCrop.cropName} की खेती करने से आपको लगभग ${bestCrop.profit} रुपये का मुनाफा हो सकता है।`;
    }
    return 'कृपया अपनी जमीन का आकार बताएं।';
  };

  return (
    <View style={styles.container}>
      <Header 
        title="फसल सलाह" 
        voiceText={getVoiceScript()}
      />

      <ScrollView style={styles.content}>
        {/* Cool Animation when analyzing */}
        {isAnalyzing && (
          <View style={styles.analyzingContainer}>
            <LottieView 
              source={require('../assets/analyzing.json')}
              autoPlay
              loop
            />
            <Text style={styles.analyzingText}>
              आपके लिए सबसे अच्छी फसल की खोज की जा रही है...
            </Text>
          </View>
        )}

        {suggestions.map((crop, index) => (
          <CropCard 
            key={index}
            suggestion={crop}
            onPress={() => showCropDetails(crop)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const CropCard = ({ suggestion, onPress }) => (
  <TouchableOpacity 
    style={[styles.card, styles.shadowProp]} 
    onPress={onPress}
  >
    <View style={styles.cropHeader}>
      <Text style={styles.cropName}>{suggestion.cropName}</Text>
      <RiskBadge risk={suggestion.risk} />
    </View>

    <View style={styles.profitSection}>
      <Text style={styles.profitLabel}>अनुमानित मुनाफा</Text>
      <Text style={styles.profitAmount}>₹{suggestion.profit}</Text>
    </View>

    <View style={styles.detailsGrid}>
      <DetailItem 
        icon="cash" 
        label="निवेश" 
        value={`₹${suggestion.investment}`} 
      />
      <DetailItem 
        icon="calendar" 
        label="समय" 
        value={`${suggestion.duration} दिन`} 
      />
      <DetailItem 
        icon="trending-up" 
        label="विश्वसनीयता" 
        value={`${suggestion.confidence}%`} 
      />
    </View>

    <View style={styles.reasonsSection}>
      <Text style={styles.reasonsTitle}>यह फसल क्यों?</Text>
      {suggestion.reasons.map((reason, idx) => (
        <Text key={idx} style={styles.reason}>• {reason}</Text>
      ))}
    </View>
  </TouchableOpacity>
); 