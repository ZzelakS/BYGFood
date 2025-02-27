import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  esbuild: {
    loader: 'jsx', // Valid loader value
  },
  server: {
    mimeTypes: {
      'css': 'text/css'
    }
  }
});
