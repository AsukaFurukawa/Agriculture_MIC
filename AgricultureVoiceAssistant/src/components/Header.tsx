import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../theme/colors';
import { VoiceFeedback } from './VoiceFeedback';

interface HeaderProps {
  title: string;
  voiceText?: string;
  onMenuPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, voiceText, onMenuPress }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
        <Icon name="menu" size={24} color={colors.text.light} />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      {voiceText && <VoiceFeedback text={voiceText} style={styles.voice} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    elevation: 4,
  },
  menuButton: {
    padding: 8,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.light,
    marginLeft: 16,
  },
  voice: {
    marginLeft: 'auto',
  },
}); 