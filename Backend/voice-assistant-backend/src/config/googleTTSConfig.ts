// This file sets up the Google Text-to-Speech client.

import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { SsmlVoiceGender } from '@google-cloud/text-to-speech/build/protos/protos';

// Create a client with Google Cloud credentials
const client = new TextToSpeechClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
});

export const ttsConfig = {
  client,
  defaultVoice: {
    languageCode: 'hi-IN',
    name: 'hi-IN-Standard-A',
    ssmlGender: 'FEMALE' as SsmlVoiceGender,
  },
  defaultAudioConfig: {
    audioEncoding: 'MP3' as const,
    speakingRate: 0.85,
    pitch: 0,
  },
};
