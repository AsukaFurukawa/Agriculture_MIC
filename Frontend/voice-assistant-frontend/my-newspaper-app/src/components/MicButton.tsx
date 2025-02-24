"use client"; // Add this directive to mark the file as a client component

import React, { useState } from 'react';

export default function MicButton() {
  const [isListening, setIsListening] = useState(false);

  const handleMicClick = () => {
    setIsListening(!isListening);
    console.log(isListening ? 'Stopped listening' : 'Started listening');
    // Placeholder for backend voice processing
  };

  return (
    <button
      onClick={handleMicClick}
      className="fixed bottom-8 right-8 bg-secondary-color p-4 rounded-full shadow-lg hover:bg-green-700 transition">
      <img src="/mic.png" alt="Mic" className="h-8" />
    </button>
  );
}
