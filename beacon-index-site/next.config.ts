import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // Allow images from public folder without optimization
  },
};

export default nextConfig;
