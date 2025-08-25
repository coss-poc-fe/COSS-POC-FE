import type { NextConfig } from "next";
 
const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',                  // Frontend route
        destination: 'https://coss-ai4x.vercel.app/:path*', // Proxy to external API
      },
    ];
  },
};
 
export default nextConfig;