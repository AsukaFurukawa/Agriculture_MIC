import React from 'react';

export default function HeroSection() {
  return (
    <section className="relative h-[500px] bg-cover bg-center" style={{ backgroundImage: "url('/background.jpg')" }}>
      <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white">
        <h1 className="text-5xl font-bold mb-4">Kisan Ki Awaz</h1>
        <p className="text-lg mb-6">Your Trusted Agriculture Newspaper</p>
        <button className="bg-secondary-color text-white px-4 py-2 rounded hover:bg-green-700">
          Explore Now
        </button>
      </div>
    </section>
  );
}
