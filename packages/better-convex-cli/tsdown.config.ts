import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/cli/cli.ts', 'src/cli/watcher.ts'],
  format: 'cjs',
  platform: 'node',
  target: 'esnext',
  tsconfig: 'tooling/tsconfig.build.json',
  shims: true,
  skipNodeModulesBundle: true,
  banner: '#!/usr/bin/env node',
});
