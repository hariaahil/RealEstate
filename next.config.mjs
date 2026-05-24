import path from 'path';

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.cloudinary.com',
      },
    ],
  },
  eslint: {
    dirs: ['app', 'components', 'lib', 'services', 'hooks', 'types'],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  webpack(config) {
    config.resolve.alias['@'] = path.resolve('./');
    return config;
  },
};

export default nextConfig;
