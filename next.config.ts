import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  },

  images: {
    unoptimized: process.env.NEXT_PUBLIC_STATIC_EXPORT === "true",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.example.com",
        pathname: "/account123/**",
      },
      {
        protocol: "https",
        hostname: "backend.vintocash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "secondbackend.vintocash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },

async rewrites() {
  return [
    {
      source: "/api/proxy/:path*",
      destination: "https://backend.vintocash.com/api/:path*",
    },
    {
      source: "/api/deal/:path*",
      destination: "https://secondbackend.vintocash.com/api/:path*",
    },
  ];
},

  output: process.env.NEXT_PUBLIC_STATIC_EXPORT === "true" ? "export" : undefined,

  trailingSlash: process.env.NEXT_PUBLIC_STATIC_EXPORT === "true",
};

export default nextConfig;