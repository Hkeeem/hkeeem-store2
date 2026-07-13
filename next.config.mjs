/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      { hostname: 'images.unsplash.com' },
      { hostname: 'i.imgur.com' },
      { hostname: 'plus.unsplash.com' },
    ],
  },
};

export default nextConfig;
