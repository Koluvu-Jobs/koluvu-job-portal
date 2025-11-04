/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance optimizations
  experimental: {
    optimizePackageImports: [
      "@fortawesome/react-fontawesome",
      "@fortawesome/free-solid-svg-icons",
    ],
  },

  // Transpile packages
  transpilePackages: ["animejs"],

  // Image optimization
  images: {
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "randomuser.me",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "example.com",
        // Optional port and pathname configurations:
        // port: '',
        // pathname: '/account123/**',
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // Google user profile pictures
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com", // GitHub profile pictures
      },
      // Local development server for Django media files
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
    ],
    minimumCacheTTL: 60,
  },

  // Compression
  compress: true,

  // Rewrites for custom paths and API proxying
  async rewrites() {
    return [
      {
        source: "/favicon.ico",
        destination: "/images/favicon.ico",
      },
      // Backend API proxying (use NEXT_PUBLIC_BACKEND_URL or fallback to IPv4)
      // Note: These rewrites should NOT catch our custom Next.js API routes
      {
        source: "/api/auth/:path*",
        destination: `${
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000"
        }/api/auth/:path*`,
      },
      // Specific employer endpoints that should go directly to Django
      {
        source: "/api/employer/register",
        destination: `${
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000"
        }/api/employer/register`,
      },
      {
        source: "/api/employer/login",
        destination: `${
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000"
        }/api/employer/login`,
      },
      {
        source: "/api/employer/profile",
        destination: `${
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000"
        }/api/employer/profile`,
      },
      {
        source: "/api/employer/profile/:path*",
        destination: `${
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000"
        }/api/employer/profile/:path*`,
      },
      {
        source: "/api/jobs",
        destination: `${
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000"
        }/api/employer/jobs`,
      },
      {
        source: "/api/jobs/:path*",
        destination: `${
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000"
        }/api/employer/jobs/:path*`,
      },
      {
        source: "/api/notifications/:path*",
        destination: `${
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000"
        }/api/notifications/:path*`,
      },
      {
        source: "/api/employee/:path*",
        destination: `${
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000"
        }/api/employee/:path*`,
      },
      {
        source: "/api/training/:path*",
        destination: `${
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000"
        }/api/training/:path*`,
      },
      {
        source: "/api/companies/:path*",
        destination: `${
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000"
        }/api/companies/:path*`,
      },
      {
        source: "/api/companies",
        destination: `${
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000"
        }/api/companies`,
      },
      // Shared services endpoints (ATS, Career Guidance, Courses)
      {
        source: "/api/shared/:path*",
        destination: `${
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000"
        }/api/shared/:path*`,
      },
    ];
  },

  // Headers for performance and security
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
      {
        source: "/images/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/videos/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  webpack: (config, { isServer }) => {
    // Add rule for PDF.js worker
    config.module.rules.push({
      test: /pdf\.worker\.(min\.)?js/,
      type: "asset/resource",
      generator: {
        filename: "static/chunks/[name].[hash][ext]",
      },
    });

    // Handle PDF.js worker in development
    if (!isServer) {
      config.resolve.alias["pdfjs-dist/build/pdf.worker.entry"] =
        "pdfjs-dist/build/pdf.worker.min.js";
    }

    // Optimize bundle size
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }

    return config;
  },
};

module.exports = nextConfig;
