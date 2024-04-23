/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client"],
  },

  output: "standalone",

  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
