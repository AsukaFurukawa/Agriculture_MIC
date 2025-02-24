import express from 'express';
import { llmService } from '../services/llmService';

const router = express.Router();

router.post('/predict', async (req, res) => {
  try {
    const { prompt } = req.body;
    const prediction = await llmService.getPrediction(prompt);
    res.json(prediction);
  } catch (error) {
    console.error('LLM error:', error);
    res.status(500).json({ error: 'Prediction failed' });
  }
});

export default router; 