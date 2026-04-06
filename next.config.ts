import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // Force Turbopack to only look in project root if it can
  }
};

export default nextConfig;
