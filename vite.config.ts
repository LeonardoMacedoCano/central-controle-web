import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { MICROSERVICES } from './src/service/Api';

const proxy = Object.keys(MICROSERVICES).reduce((acc, key) => {
  const config = MICROSERVICES[key as keyof typeof MICROSERVICES];
  acc[config.url] = {
    target: `http://localhost:${config.port}`,
    changeOrigin: true,
    rewrite: (path: string) => path.replace(config.url, '/api'),
  };
  return acc;
}, {} as Record<string, { target: string; changeOrigin: boolean; rewrite: (path: string) => string }>);

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    proxy,
  },
});
