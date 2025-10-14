import { defineConfig } from 'vite'

// Dynamically import the plugin to avoid ESM `require` issues when esbuild runs
export default async () => {
  const react = (await import('@vitejs/plugin-react')).default
  return defineConfig({
    plugins: [react()],
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: 'src/setupTests.ts',
      coverage: {
        provider: 'v8'
      }
    }
  }) as any
}
