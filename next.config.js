/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  typescript:{
    ignoreBuildErrors: true
  }
};

module.exports = nextConfig;
