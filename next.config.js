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
  // Disable telemetry and tracing to avoid file permission issues
  telemetry: {
    enabled: false,
  },
  experimental: {
    instrumentationHook: false,
  },
};

module.exports = nextConfig;