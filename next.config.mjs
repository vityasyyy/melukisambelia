import createMDX from './mdx-config.mjs'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  async rewrites() {
    return [
      { source: '/admin', destination: '/admin/index.html' },
    ]
  },
}

const withMDX = createMDX(nextConfig)
export default withMDX