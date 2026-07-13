/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
}
export default nextConfig
images: { remotePatterns: [{ hostname: 'images.unsplash.com' }] }
