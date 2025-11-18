// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Bundle optimization
  experimental: {
    optimizePackageImports: ["lucide-react", "@mui/material", "framer-motion"],
  },
  // Compress output
  compress: true,
  // Optimize images
  images: {
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
      },
    ],
  },
  transpilePackages: ["animejs"],
  // Reduce bundle size
  webpack: (config, { isServer }) => {
    // Tree shake unused code
    config.optimization = {
      ...config.optimization,
      usedExports: true,
      sideEffects: false,
    };

    // Exclude large unused modules
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    return config;
  },
};

export default nextConfig;
