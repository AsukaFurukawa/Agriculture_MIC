import './globals.css'
import React from 'react'
import { Metadata } from 'next'
import AppNav from '../components/AppNav'

export const metadata: Metadata = {
  title: 'Epic Vintage Newspaper',
  description: 'Old-school meets dynamic animations. Same structure, cooler style!',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppNav />
        {children}
      </body>
    </html>
  )
}
