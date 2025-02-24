"use client";

import React, { useEffect, useState } from 'react';

export default function LanguageDropdown() {
  const [currentLanguage, setCurrentLanguage] = useState('Loading...');

  useEffect(() => {
    async function fetchLanguage() {
      try {
        const res = await fetch('/api/language/detect'); // Using the proxied route
        const data = await res.json();
        setCurrentLanguage(data.language || 'English');
      } catch (err) {
        console.error('Error detecting language:', err);
        setCurrentLanguage('English'); // Fallback to English
      }
    }
    fetchLanguage();
  }, []);

  const handleLanguageChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value;
    try {
      await fetch('/api/language/set', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: newLanguage }),
      });
      setCurrentLanguage(newLanguage);
    } catch (err) {
      console.error('Error setting language:', err);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="languageSelect" className="font-semibold">
        Language:
      </label>
      <select
        id="languageSelect"
        value={currentLanguage}
        onChange={handleLanguageChange}
        className="border border-gray-400 rounded p-2 bg-white"
      >
        <option value="English">English</option>
        <option value="Hindi">Hindi</option>
        <option value="Kannada">Kannada</option>
        <option value="Telugu">Telugu</option>
        <option value="Tamil">Tamil</option>
      </select>
    </div>
  );
}
