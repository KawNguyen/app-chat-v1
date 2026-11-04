import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "7777",
        pathname: "/uploads/**",
      },
    ],
  },
}

export default nextConfig
