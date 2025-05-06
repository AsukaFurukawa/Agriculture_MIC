import { AppRegistry } from 'react-native';
import WebApp from './WebApp';
import { Platform } from 'react-native';

// Fix React Native Web text node issue
if (Platform.OS === 'web') {
  // This prevents "Unexpected text node" errors in React Native Web
  // by ensuring React DOM's Text component is used properly
  AppRegistry.registerComponent('AgricultureVoiceAssistant', () => WebApp);
  AppRegistry.runApplication('AgricultureVoiceAssistant', {
    rootTag: document.getElementById('root')
  });
}

export default WebApp; 