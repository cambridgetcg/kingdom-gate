import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // this repo is the root, whatever stray lockfiles live above it
  turbopack: { root: __dirname },
};

export default nextConfig;
