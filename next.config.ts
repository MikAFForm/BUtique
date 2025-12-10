import type { NextConfig } from "next";

// Target for proxying frontend /api/graphql to the Python backend to avoid CORS
const backendGraphql =
  process.env.BACKEND_GRAPHQL_URL ?? "http://localhost:4000/graphql";

const nextConfig: NextConfig = {
  experimental: {
    // @ts-expect-error allowedDevOrigins may not be typed in this Next version
    allowedDevOrigins: [
      "http://localhost:3000",
      "http://10.239.212.67:3000", // current dev IP to silence CORS warnings
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/graphql",
        destination: backendGraphql,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
