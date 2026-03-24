import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: '*.googleusercontent.com' },
      { protocol: 'https', hostname: 'platform-lookaside.fbsbx.com' },
      { protocol: 'https', hostname: '*.fbcdn.net' },
      { protocol: 'https', hostname: '*.squarespace.com' },
      { protocol: 'http', hostname: '*.squarespace.com' },
      { protocol: 'https', hostname: '*.wixstatic.com' },
      { protocol: 'https', hostname: '*.wsimg.com' },
      { protocol: 'https', hostname: 'mercier-orchards.com' },
      { protocol: 'https', hostname: 'dirtandgritfarm.com' },
      { protocol: 'https', hostname: 'greerfarmersmarket.com' },
      { protocol: 'https', hostname: 'steppapples.com' },
      { protocol: 'https', hostname: 'asapconnections.org' },
      { protocol: 'https', hostname: 'lookaside.fbsbx.com' },
    ],
  },
};

export default nextConfig;
