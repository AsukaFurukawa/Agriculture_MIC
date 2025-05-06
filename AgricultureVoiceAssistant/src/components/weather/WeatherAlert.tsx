import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Icon } from '../Icon';
import { colors } from '../../theme/colors';

interface WeatherAlertProps {
  type: 'warning' | 'danger' | 'info';
  title: string;
  message: string;
  onDismiss?: () => void;
}

export const WeatherAlert: React.FC<WeatherAlertProps> = ({
  type,
  title,
  message,
  onDismiss,
}) => {
  const getAlertStyle = () => {
    switch (type) {
      case 'danger':
        return {
          backgroundColor: colors.error,
          icon: 'alert-circle',
        };
      case 'warning':
        return {
          backgroundColor: colors.warning,
          icon: 'alert',
        };
      default:
        return {
          backgroundColor: colors.info,
          icon: 'information',
        };
    }
  };

  const alertStyle = getAlertStyle();

  return (
    <Animated.View style={[styles.container, { backgroundColor: alertStyle.backgroundColor }]}>
      <View style={styles.content}>
        <Icon name={alertStyle.icon} size={24} color={colors.text.light} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
        </View>
      </View>
      {onDismiss && (
        <TouchableOpacity onPress={onDismiss} style={styles.dismissButton}>
          <Icon name="close" size={20} color={colors.text.light} />
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    marginLeft: 12,
    flex: 1,
  },
  title: {
    color: colors.text.light,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  message: {
    color: colors.text.light,
    fontSize: 14,
  },
  dismissButton: {
    marginLeft: 12,
  },
}); 