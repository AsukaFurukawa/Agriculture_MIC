import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../Card';
import { Icon } from '../Icon';
import { colors } from '../../theme/colors';

interface TraditionalWisdomProps {
  signs: string[];
  advice: string[];
}

export const TraditionalWisdomCard: React.FC<TraditionalWisdomProps> = ({
  signs,
  advice,
}) => {
  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <Icon name="leaf" size={24} color={colors.primary} />
        <Text style={styles.title}>पारंपरिक मौसम ज्ञान</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>प्राकृतिक संकेत:</Text>
        {signs.map((sign, index) => (
          <View key={index} style={styles.item}>
            <Icon name="circle-small" size={20} color={colors.primary} />
            <Text style={styles.text}>{sign}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>किसान की सलाह:</Text>
        {advice.map((item, index) => (
          <View key={index} style={styles.item}>
            <Icon name="check-circle" size={20} color={colors.success} />
            <Text style={styles.text}>{item}</Text>
          </View>
        ))}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginLeft: 8,
  },
  section: {
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  text: {
    fontSize: 14,
    color: colors.text.secondary,
    marginLeft: 8,
    flex: 1,
  },
}); 