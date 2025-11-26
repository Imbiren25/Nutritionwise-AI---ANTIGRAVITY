import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const port = Number(env.PORT || env.VITE_PORT) || 3000;
  const previewPort = Number(env.PREVIEW_PORT || env.PORT || env.VITE_PORT) || 3000;

  return {
    server: {
      port,
      host: '0.0.0.0',
      hmr: {
        overlay: true,
      },
    },
    preview: {
      port: previewPort,
      host: '0.0.0.0',
    },
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    css: {
      devSourcemap: true,
    },
    build: {
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/analytics'],
            recharts: ['recharts'],
            pdf: ['./components/PDFViewer.tsx'],
            charts: ['./components/NutrientChart.tsx']
          }
        }
      }
    },
  };
});
