/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: "/aviso-legal.html", destination: "/aviso-legal", permanent: true },
      { source: "/politica-privacidad.html", destination: "/politica-privacidad", permanent: true },
      { source: "/politica-cookies.html", destination: "/politica-cookies", permanent: true }
    ];
  },
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
