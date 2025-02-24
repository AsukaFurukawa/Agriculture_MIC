// This is the file where you initialize the server and load routes.

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import languageRoutes from './routes/languageRoutes';
import weatherRoutes from './routes/weatherRoutes';
import llmRoutes from './routes/llmRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/language', languageRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/llm', llmRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
