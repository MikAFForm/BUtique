import type { NextConfig } from "next";

// Target for proxying frontend /api/graphql to the Python backend to avoid CORS
const backendGraphql =
  process.env.BACKEND_GRAPHQL_URL ?? "http://localhost:4000/graphql";

const nextConfig: NextConfig = {
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
