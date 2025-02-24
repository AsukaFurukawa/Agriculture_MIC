import React from 'react';
import Link from 'next/link';

export default function AppNav() {
  return (
    <nav className="flex justify-between items-center py-4 px-6 bg-white shadow-md">
      <Link href="/">
        <img src="/logo.png" alt="Kisan Ki Awaz" className="h-10" />
      </Link>
      <div className="flex space-x-6">
        <Link href="/weather" className="hover:underline">Weather</Link>
        <Link href="/market" className="hover:underline">Market</Link>
        <Link href="/tips" className="hover:underline">Tips</Link>
      </div>
    </nav>
  );
}
