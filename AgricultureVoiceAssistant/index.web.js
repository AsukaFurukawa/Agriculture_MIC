// Web entry point
import { AppRegistry } from 'react-native';
import App from './src/App';
import WebApp from './src/web/WebApp';

// Use WebApp for web and App for native
const EntryComponent = WebApp;

AppRegistry.registerComponent('AgricultureVoiceAssistant', () => EntryComponent);
AppRegistry.runApplication('AgricultureVoiceAssistant', {
  rootTag: document.getElementById('root')
});