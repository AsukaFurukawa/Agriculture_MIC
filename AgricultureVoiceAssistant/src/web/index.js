import { AppRegistry, Text } from 'react-native';
import WebApp from './WebApp';
import { Platform } from 'react-native';
import React from 'react';

// Fix React Native Web text node issue
if (Platform.OS === 'web') {
  // This prevents "Unexpected text node" errors in React Native Web
  // by ensuring React DOM's Text component is used properly
  
  // Override the View component to fix the "Unexpected text node" errors
  const originalRender = Text.render;
  if (originalRender) {
    Text.render = function(...args) {
      const origin = originalRender.apply(this, args);
      return React.cloneElement(origin, {
        style: [origin.props.style, { wordWrap: 'break-word' }],
      });
    };
  }
  
  // Register the app
  AppRegistry.registerComponent('AgricultureVoiceAssistant', () => WebApp);
  AppRegistry.runApplication('AgricultureVoiceAssistant', {
    rootTag: document.getElementById('root')
  });
}

export default WebApp; 