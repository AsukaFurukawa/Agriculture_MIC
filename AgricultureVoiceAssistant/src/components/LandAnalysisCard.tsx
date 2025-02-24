export const LandAnalysisCard = ({ suggestions }) => (
  <View style={styles.container}>
    <Text style={styles.title}>आपकी जमीन के लिए फसल सुझाव</Text>
    
    {/* Weather and Soil Alerts */}
    {(suggestions.weatherAlert || suggestions.soilHealth) && (
      <View style={styles.alertSection}>
        {suggestions.weatherAlert && (
          <View style={styles.alert}>
            <Icon name="weather-pouring" size={20} color={colors.error} />
            <Text style={styles.alertText}>{suggestions.weatherAlert}</Text>
          </View>
        )}
        <View style={styles.alert}>
          <Icon name="soil" size={20} color={colors.primary} />
          <Text style={styles.alertText}>{suggestions.soilHealth}</Text>
        </View>
      </View>
    )}

    {/* Main Crop Suggestions */}
    {suggestions.mainCrops.map((crop, index) => (
      <Pressable 
        key={index} 
        style={styles.cropCard}
        onPress={() => Tts.speak(`${crop.crop} के बारे में: ${crop.reason}`)}
      >
        <View style={styles.cropHeader}>
          <Icon name="sprout" size={24} color={colors.primary} />
          <Text style={styles.cropName}>{crop.crop}</Text>
          <Badge text={crop.marketTrend} />
        </View>
        
        <View style={styles.detailsGrid}>
          <DetailItem 
            icon="ruler" 
            label="क्षेत्रफल" 
            value={crop.area} 
          />
          <DetailItem 
            icon="cash" 
            label="अनुमानित मुनाफा" 
            value={crop.expectedProfit} 
          />
          <DetailItem 
            icon="government" 
            label="सरकारी समर्थन" 
            value={crop.governmentSupport} 
          />
        </View>

        <View style={styles.timelineSection}>
          <Text style={styles.timelineTitle}>समय सारिणी:</Text>
          <View style={styles.timeline}>
            <TimelineItem 
              label="बुवाई" 
              value={crop.timeline.sowing} 
            />
            <TimelineItem 
              label="कटाई" 
              value={crop.timeline.harvest} 
            />
          </View>
        </View>

        <View style={styles.extraInfo}>
          <Text style={styles.infoText}>
            • सर्वोत्तम किस्म: {crop.bestVariety}
          </Text>
          <Text style={styles.infoText}>
            • सिंचाई: {crop.waterNeeded}
          </Text>
          <Text style={styles.infoText}>
            • भंडारण: {crop.storageAvailable}
          </Text>
        </View>
      </Pressable>
    ))}

    {/* Alternative Suggestions */}
    <View style={styles.alternativesSection}>
      <Text style={styles.altTitle}>वैकल्पिक फसलें:</Text>
      {suggestions.alternativeCrops.map((alt, index) => (
        <Text key={index} style={styles.altText}>
          • {alt.crop}: {alt.reason}
        </Text>
      ))}
    </View>
  </View>
); 