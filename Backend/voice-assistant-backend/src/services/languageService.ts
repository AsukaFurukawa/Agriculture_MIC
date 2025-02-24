// // This file contains the logic for detecting and setting languages.

// import { Request, Response } from 'express';
// import geoip from 'geoip-lite';

// //const userPreferences: { [ip: string]: string } = {};
// const userPreferences: { [key: string]: string } = {};

// // Detect language based on IP
// export const detectLanguage = (req: Request, res: Response) => {
//     const ip = req.ip; // Get the user's IP
//     const geo = geoip.lookup(ip);
//     const language = geo?.country === 'IN' ? 'Hindi' : 'English'; // Example logic
//     res.json({ language });
// };

// // Set language manually
// export const setLanguage = (req: Request, res: Response) => {
//     const { language } = req.body;
//     const userIp = req.ip || 'unknown'; // Ensure userIp is always a string
//     userPreferences[userIp] = language;
//     res.json({ message: `Language set to ${language}` });
// };

import { Request } from 'express';
import geoip from 'geoip-lite';

// Detect language based on IP
export const detectLanguage = (req: Request): string => {
  const ip = (req.headers['x-forwarded-for'] as string) || req.connection.remoteAddress || '127.0.0.1';
  const geo = geoip.lookup(ip);
  if (geo?.country === 'IN') {
    return 'Hindi';
  }
  return 'English';
};

export const languageService = {
  detectLanguage: async (text: string): Promise<string> => {
    const script = getScript(text);
    return scriptToLanguage(script);
  },

  getSupportedLanguages: () => {
    return [
      { code: 'hi-IN', name: 'Hindi' },
      { code: 'en-IN', name: 'English' },
      { code: 'mr-IN', name: 'Marathi' },
      { code: 'gu-IN', name: 'Gujarati' },
      { code: 'pa-IN', name: 'Punjabi' },
      { code: 'bn-IN', name: 'Bengali' },
      { code: 'ta-IN', name: 'Tamil' },
      { code: 'te-IN', name: 'Telugu' },
      { code: 'kn-IN', name: 'Kannada' },
    ];
  },
};

function getScript(text: string): string {
  const devanagariRange = /[\u0900-\u097F]/;
  const latinRange = /[A-Za-z]/;

  if (devanagariRange.test(text)) return 'Devanagari';
  if (latinRange.test(text)) return 'Latin';
  return 'Unknown';
}

function scriptToLanguage(script: string): string {
  switch (script) {
    case 'Devanagari':
      return 'hi-IN';
    case 'Latin':
      return 'en-IN';
    default:
      return 'hi-IN';
  }
}
