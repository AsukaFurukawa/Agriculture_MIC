import React from 'react';
import HeroSection from '../components/HeroSection';
import NewsCard from '../components/NewsCard';
import MicButton from '../components/MicButton';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <NewsCard title="Weather Updates" content="Real-time weather for your region." />
        <NewsCard title="Market Trends" content="Updates on crop prices and trends." />
        <NewsCard title="Farming Tips" content="Best practices for agriculture." />
      </div>
      <MicButton />
    </>
  );
}
