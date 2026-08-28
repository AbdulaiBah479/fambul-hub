/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Keep pages fully static where possible — cheapest to serve and
  // fastest on the slow/expensive connections most users will have.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
