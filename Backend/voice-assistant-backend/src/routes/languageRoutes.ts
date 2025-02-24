// // This file contains routes for language detection and toggling

// import { Router } from 'express';
// import { detectLanguage, setLanguage } from '../services/languageService';

// const router = Router();

// // Detect language
// router.get('/detect', detectLanguage);

// // Set language
// router.post('/set', setLanguage);

// export default router;

import express from 'express';
import { languageService } from '../services/languageService';

const router = express.Router();

router.post('/detect', async (req, res) => {
  try {
    const { text } = req.body;
    const detectedLanguage = await languageService.detectLanguage(text);
    res.json({ language: detectedLanguage });
  } catch (error) {
    res.status(500).json({ error: 'Language detection failed' });
  }
});

router.get('/supported', (req, res) => {
  const supportedLanguages = languageService.getSupportedLanguages();
  res.json({ languages: supportedLanguages });
});

export default router;

