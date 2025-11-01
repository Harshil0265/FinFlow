/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@clerk/nextjs'],
  webpack: (config, { isServer }) => {
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