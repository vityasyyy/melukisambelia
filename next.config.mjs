import createMDX from './mdx-config.mjs'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
  productionBrowserSourceMaps: false,
  reactStrictMode: true,
  async rewrites() {
    return [
      { source: '/admin', destination: '/admin/index.html' },
      { source: '/admin/', destination: '/admin/index.html' },
    ]
  },
}

const withMDX = createMDX(nextConfig)
export default withMDX