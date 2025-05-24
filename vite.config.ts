import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: '/projeto-talentos/',
  server: {
    host: "localhost",
    port: 8080,
    strictPort: true,
    headers: {
      "X-Frame-Options": "DENY",
      "X-Content-Type-Options": "nosniff",
      "X-XSS-Protection": "1; mode=block"
    }
  },
  plugins: [
    react(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },  build: {
    assetsDir: 'assets',
    sourcemap: true,
    minify: 'esbuild', // usando esbuild em vez de terser para simplificar
  },
  publicDir: 'public',
}));
