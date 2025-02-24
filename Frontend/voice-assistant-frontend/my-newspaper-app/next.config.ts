import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*', // Match API routes
        destination: 'http://localhost:3000/:path*', // Proxy to backend
      },
    ];
  },
};

export default nextConfig;
