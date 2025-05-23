/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/points',
        destination: 'http://localhost:3000/points',
      },
    ];
  },
};

module.exports = nextConfig;
