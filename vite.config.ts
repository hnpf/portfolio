import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react(), tailwindcss()],
    envPrefix: ['VITE_', 'LASTFM_'],
    define: {
      'import.meta.env.VITE_LASTFM_API_KEY': JSON.stringify(env.VITE_LASTFM_API_KEY || env.LASTFM_API_KEY || ''),
      'import.meta.env.VITE_LASTFM_USERNAME': JSON.stringify(env.VITE_LASTFM_USERNAME || env.LASTFM_USERNAME || ''),
      'import.meta.env.LASTFM_API_KEY': JSON.stringify(env.LASTFM_API_KEY || env.VITE_LASTFM_API_KEY || ''),
      'import.meta.env.LASTFM_USERNAME': JSON.stringify(env.LASTFM_USERNAME || env.VITE_LASTFM_USERNAME || ''),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 6767,
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:3001',
          changeOrigin: true,
        },
      },
    },
  };
});