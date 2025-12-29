// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
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
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/media/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "koluvu-job-portal.onrender.com",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "koluvu-ai-job-portal.onrender.com",
        pathname: "/media/**",
      },
    ],
  },
  transpilePackages: ["animejs"],

  // API rewrites for production
  async rewrites() {
    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";

    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
      {
        source: "/media/:path*",
        destination: `${backendUrl}/media/:path*`,
      },
    ];
  },
};

export default nextConfig;
