import path from 'path';

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  turbopack: {},
  webpack(config) {
    config.resolve.alias['@'] = path.resolve('./');
    return config;
  },
};

export default nextConfig;
