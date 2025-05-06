import React, { createContext, useContext, ReactNode } from 'react';

// Weather data interfaces
interface WeatherForecast {
  day: string;
  temp: number;
  condition: string;
}

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  forecast: WeatherForecast[];
}

// Market data interfaces
interface Crop {
  name: string;
  price: number;
  trend: string;
  change: string;
}

interface Market {
  name: string;
  distance: string;
}

interface MarketData {
  crops: Crop[];
  nearbyMarkets: Market[];
}

// Tips data interfaces
interface SeasonalTip {
  title: string;
  description: string;
}

interface CropTip {
  crop: string;
  tip: string;
}

interface SustainableTip {
  title: string;
  description: string;
}

interface TipsData {
  seasonal: SeasonalTip[];
  crops: CropTip[];
  sustainable: SustainableTip[];
}

// Recommended crop interface
interface RecommendedCrop extends Crop {
  suitability: string;
  reason: string;
}

interface WebAppContextType {
  userMessage: string;
  setUserMessage: (message: string) => void;
  assistantResponse: string;
  setAssistantResponse: (response: string) => void;
  language: string;
  setLanguage: (language: string) => void;
  locationName: string;
  setLocationName: (location: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  weatherData: WeatherData | null;
  marketData: MarketData | null;
  tipsData: TipsData | null;
  recommendedCrops: RecommendedCrop[];
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const WebAppContext = createContext<WebAppContextType | undefined>(undefined);

interface WebAppProviderProps {
  children: ReactNode;
  value: WebAppContextType;
}

export function WebAppProvider({ children, value }: WebAppProviderProps) {
  return (
    <WebAppContext.Provider value={value}>
      {children}
    </WebAppContext.Provider>
  );
}

export function useWebAppContext() {
  const context = useContext(WebAppContext);
  if (context === undefined) {
    throw new Error('useWebAppContext must be used within a WebAppProvider');
  }
  return context;
} 