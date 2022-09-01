/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  images: {
    domains: ["images.unsplash.com"],
  },
  reactStrictMode: false,
};

module.exports = nextConfig;
