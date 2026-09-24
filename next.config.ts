import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "localhost",
    "localhost:3000",
    "127.0.0.1",
    "127.0.0.1:3000",
    "10.12.3.3",
    "10.12.3.3:3000",
    "z2t3c3.42bangkok.com",
    "z2t3c3.42bangkok.com:3000",
    "*.42bangkok.com",
    "*.42bangkok.com:3000",
    "*.local"
  ],
};

export default nextConfig;
