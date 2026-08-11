/** @type {import('next').NextConfig} */
const nextConfig = {
  logging: {
    browserToTerminal: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "genuslab-tech-images.s3.us-east-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

module.exports = nextConfig;
