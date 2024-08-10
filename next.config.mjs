import { fileURLToPath } from 'node:url'
import createJiti from 'jiti'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./lib/i18n.ts')

const jiti = createJiti(fileURLToPath(import.meta.url))
const { PATHNAMES } = jiti('./config/pathnames')

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  transpilePackages: ['@tanstack/query-core'],
  rewrites: async () => {
    const result = Object.entries(PATHNAMES).map(([destination, source]) => ({
      source,
      destination,
    }))
    return result
  },
}

export default withNextIntl(nextConfig)
