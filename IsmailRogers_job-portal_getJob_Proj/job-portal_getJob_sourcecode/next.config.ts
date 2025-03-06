import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      { hostname: "firebasestorage.googleapis.com" },
      { hostname: "img.clerk.com" },
    ],
  },

  reactStrictMode: false, // Disable strict mode


};

export default nextConfig;
