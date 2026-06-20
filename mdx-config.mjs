import createMDXPlugin from '@next/mdx'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'

/** @type {import('@next/mdx').MDXOptions} */
export default function createMDX(nextConfig) {
  const withMDX = createMDXPlugin({
    extension: /\.mdx?$/,
    options: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }]],
    },
  })
  return withMDX({
    ...nextConfig,
    pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  })
}