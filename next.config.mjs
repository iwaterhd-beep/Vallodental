/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.wixstatic.com"
      },
      {
        protocol: "https",
        hostname: "sylkabfjvjhfkhxjogqv.supabase.co"
      }
    ]
  }
};

export default nextConfig;
