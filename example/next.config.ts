import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    browserDebugInfoInTerminal: true,
  },
  reactCompiler: true,
  typedRoutes: true,
};

export default nextConfig;
