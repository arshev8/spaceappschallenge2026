import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    rollupOptions: {
      // Keep React in its own long-cached chunk; app code and translations change more often.
      output: { manualChunks: id => (/node_modules\/(react|react-dom|scheduler)\//.test(id) ? 'react' : undefined) },
    },
  },
  test: { environment: 'jsdom', clearMocks: true, restoreMocks: true },
});
