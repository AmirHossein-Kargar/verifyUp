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

  /* Experimental features for better performance */
  experimental: {
    optimizePackageImports: ["framer-motion", "react-hook-form"],
  },
};

export default nextConfig;
