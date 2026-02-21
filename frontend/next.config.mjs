/** @type {import('next').NextConfig} */
const nextConfig = {
  /* React Compiler for better performance */
  reactCompiler: true,

  /* Image optimization */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "flowbite.com",
        pathname: "/docs/images/**",
      },
      {
        protocol: "https",
        hostname: "cdn.worldvectorlogo.com",
        pathname: "/logos/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "4000",
        pathname: "/api/users/profile-image/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "4000",
        pathname: "/api/users/profile-image/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  /* Compression */
  compress: true,

  /* Production optimizations */
  productionBrowserSourceMaps: false,
  poweredByHeader: false,

  /* Caching headers for static assets (skip in dev to avoid serving stale JS) */
  async headers() {
    const isDev = process.env.NODE_ENV === "development";
    if (isDev) return [];
    return [
      {
        source: "/:all*(svg|jpg|jpeg|png|gif|ico|webp|avif)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/fonts/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  /* Experimental features for better performance */
  experimental: {
    optimizePackageImports: ["framer-motion", "react-hook-form"],
  },
};

export default nextConfig;
