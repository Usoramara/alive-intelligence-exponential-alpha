import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // Bare /execution → serve index.html
      {
        source: "/execution",
        destination: "/execution/index.html",
      },
      // SPA fallback: serve /execution/index.html for all /execution/* routes
      {
        source: "/execution/:path((?!assets|audio-processor\\.js|favicon).*)",
        destination: "/execution/index.html",
      },
    ];
  },
};

export default nextConfig;
