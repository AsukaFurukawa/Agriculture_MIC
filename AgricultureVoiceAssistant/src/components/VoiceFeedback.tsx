import React from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import { colors } from '../theme/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface VoiceFeedbackProps {
  visible: boolean;
}

export const VoiceFeedback: React.FC<VoiceFeedbackProps> = ({ visible }) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
    >
      <View style={styles.container}>
        <View style={styles.feedback}>
          <Icon name="waveform" size={40} color={colors.primary} />
          <Text style={styles.text}>मैं सुन रहा हूं...</Text>
          <Text style={styles.hint}>कृपया अपना प्रश्न बोलें</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  feedback: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    marginTop: 12,
    color: colors.text.primary,
  },
  hint: {
    fontSize: 14,
    marginTop: 8,
    color: colors.text.secondary,
  },
}); 