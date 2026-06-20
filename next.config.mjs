import createMDX from './mdx-config.mjs'

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
}

const withMDX = createMDX(nextConfig)
export default withMDX