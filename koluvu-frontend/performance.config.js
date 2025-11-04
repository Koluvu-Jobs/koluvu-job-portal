// Performance Configuration for Koluvu Job Portal
// This file contains performance optimization settings

const performanceConfig = {
  // Image optimization settings
  images: {
    formats: ['image/webp', 'image/jpeg'],
    quality: 85,
    sizes: [320, 640, 768, 1024, 1280, 1600],
    placeholder: 'blur',
    loading: 'lazy',
    domains: ['placehold.co', 'via.placeholder.com'],
  },

  // Code splitting and dynamic imports
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        default: false,
        vendors: false,
        // Vendor chunk
        vendor: {
          name: 'vendor',
          chunks: 'all',
          test: /node_modules/,
          priority: 20,
        },
        // Common chunk
        common: {
          name: 'common',
          minChunks: 2,
          priority: 10,
          reuseExistingChunk: true,
        },
      },
    },
  },

  // Compression settings
  compression: {
    gzip: true,
    brotli: true,
  },

  // Caching strategies
  cache: {
    type: 'filesystem',
    allowCollectingMemory: false,
    buildDependencies: {
      config: [__filename],
    },
  },

  // Bundle analyzer settings
  analyzer: {
    enabled: process.env.ANALYZE === 'true',
    bundleAnalyzer: {
      openAnalyzer: false,
      analyzerMode: 'static',
      reportFilename: 'bundle-analysis.html',
    },
  },

  // Performance hints
  performance: {
    maxAssetSize: 250000,
    maxEntrypointSize: 250000,
    hints: process.env.NODE_ENV === 'production' ? 'warning' : false,
  },

  // Preload and prefetch strategies
  preload: {
    // Critical resources to preload
    critical: [
      '/fonts/inter-var.woff2',
      '/images/logo.svg',
    ],
    // Resources to prefetch
    prefetch: [
      '/api/user-profile',
      '/api/jobs',
    ],
  },

  // Service Worker configuration
  serviceWorker: {
    enabled: process.env.NODE_ENV === 'production',
    strategies: {
      pages: 'networkFirst',
      images: 'cacheFirst',
      fonts: 'cacheFirst',
      api: 'networkFirst',
      static: 'cacheFirst',
    },
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/api\./,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'api-cache',
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 60 * 60 * 24, // 24 hours
          },
        },
      },
      {
        urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'image-cache',
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
          },
        },
      },
    ],
  },

  // Critical CSS extraction
  criticalCSS: {
    enabled: true,
    inline: true,
    minify: true,
    ignore: [
      '@font-face',
      /url\(/,
    ],
  },

  // Font optimization
  fonts: {
    preload: [
      {
        href: '/fonts/inter-var.woff2',
        as: 'font',
        type: 'font/woff2',
        crossorigin: 'anonymous',
      },
    ],
    fallbacks: {
      'Inter': 'system-ui, -apple-system, sans-serif',
    },
  },

  // Lazy loading configuration
  lazyLoading: {
    images: true,
    components: [
      'Dashboard',
      'Profile',
      'Applications',
      'ResumeBuilder',
      'MockInterview',
    ],
    intersectionObserver: {
      rootMargin: '50px',
      threshold: 0.1,
    },
  },
};

module.exports = performanceConfig;
