import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card } from '../Card';
import { Icon } from '../Icon';
import { colors } from '../../theme/colors';

interface CropActivity {
  month: string;
  activities: {
    type: string;
    description: string;
    icon: string;
  }[];
}

interface CropCalendarProps {
  cropName: string;
  activities: CropActivity[];
}

export const CropCalendar: React.FC<CropCalendarProps> = ({
  cropName,
  activities,
}) => {
  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <Icon name="calendar" size={24} color={colors.primary} />
        <Text style={styles.title}>{cropName} कृषि कैलेंडर</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {activities.map((activity, index) => (
          <View key={index} style={styles.monthCard}>
            <Text style={styles.monthTitle}>{activity.month}</Text>
            {activity.activities.map((item, idx) => (
              <View key={idx} style={styles.activity}>
                <Icon name={item.icon} size={20} color={colors.primary} />
                <View style={styles.activityContent}>
                  <Text style={styles.activityType}>{item.type}</Text>
                  <Text style={styles.activityDescription}>
                    {item.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
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
  monthCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    width: 200,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
  },
  activity: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 4,
  },
  activityContent: {
    marginLeft: 8,
    flex: 1,
  },
  activityType: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  activityDescription: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2,
  },
}); 