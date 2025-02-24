"use client";
import React from 'react'

export default function WeatherPage() {
  return (
    <main className="p-4 font-script">
      <article className="article-box">
        <h1 className="text-3xl font-bold mb-2">Weather Updates</h1>
        <hr className="decorative-line" />
        <p>Here you could display real-time weather data fetched from your backend or an API.</p>
      </article>
    </main>
  )
}
