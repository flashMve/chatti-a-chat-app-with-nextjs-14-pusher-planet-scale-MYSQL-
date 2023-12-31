/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "lh3.googleusercontent.com",
        protocol: "https",
        pathname: "/**/*",
      },
    ],
  },
  reactStrictMode: false,
};

module.exports = nextConfig;
