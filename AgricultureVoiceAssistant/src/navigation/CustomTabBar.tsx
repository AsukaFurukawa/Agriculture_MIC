import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../theme/colors';

const TAB_ICONS = {
  Weather: 'weather-partly-cloudy',
  Market: 'store',
  CropAdvice: 'sprout',
  Settings: 'cog',
};

const TAB_LABELS = {
  Weather: 'मौसम',
  Market: 'बाज़ार',
  CropAdvice: 'फसल सलाह',
  Settings: 'सेटिंग्स',
};

export const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={[
              styles.tab,
              isFocused && styles.activeTab
            ]}
          >
            <Icon
              name={TAB_ICONS[route.name]}
              size={24}
              color={isFocused ? colors.primary : colors.text.secondary}
            />
            <Text style={[
              styles.label,
              isFocused && styles.activeLabel
            ]}>
              {TAB_LABELS[route.name]}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    paddingBottom: 8,
    paddingTop: 12,
    elevation: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    padding: 8,
  },
  activeTab: {
    borderTopWidth: 2,
    borderTopColor: colors.primary,
  },
  label: {
    fontSize: 12,
    marginTop: 4,
    color: colors.text.secondary,
  },
  activeLabel: {
    color: colors.primary,
  },
}); 