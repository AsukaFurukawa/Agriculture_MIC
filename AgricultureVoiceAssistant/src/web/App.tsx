import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WebAppProvider } from './contexts/WebAppContext';
import HomePage from './pages/HomePage';
import WeatherPage from './pages/WeatherPage';
import MarketPage from './pages/MarketPage';
import TipsPage from './pages/TipsPage';
import PredictionsPage from './pages/PredictionsPage';
import AppNavigation from './navigation/AppNavigation';
import { View, StyleSheet } from 'react-native';

export default function App() {
  return (
    <WebAppProvider>
      <Router>
        <View style={styles.container}>
          <View style={styles.content}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/weather" element={<WeatherPage />} />
              <Route path="/market" element={<MarketPage />} />
              <Route path="/tips" element={<TipsPage />} />
              <Route path="/predictions" element={<PredictionsPage />} />
            </Routes>
          </View>
          <AppNavigation />
        </View>
      </Router>
    </WebAppProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: 1,
    overflow: 'auto',
  },
}); 