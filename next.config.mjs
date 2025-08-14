/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [
        'localhost:3000',
        '*.app.github.dev',
        '*.githubpreview.dev',
        '*.preview.app.github.dev',
        '*.github.dev',
        '*'
      ]
    }
  }
};

export default nextConfig;
