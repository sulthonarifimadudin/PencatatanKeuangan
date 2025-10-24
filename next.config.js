/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true
  },
  basePath: "/PencatatanKeuangan",
  assetPrefix: "/PencatatanKeuangan/",
};

module.exports = nextConfig;
