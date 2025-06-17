import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/projeto-talentos/' : '/',
  server: {
    host: "localhost",
    port: 8080,
    strictPort: true,
    headers: {
      "X-Frame-Options": "DENY",
      "X-Content-Type-Options": "nosniff",
      "X-XSS-Protection": "1; mode=block",      // Adicionando CORS headers para desenvolvimento e produção
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
      "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, Authorization, apikey, x-client-info"
    }
  },
  plugins: [react()],
  define: {
    // Definindo variáveis de ambiente
    'process.env.NODE_ENV': JSON.stringify(mode),
    '__SUPABASE_URL__': JSON.stringify(process.env.VITE_SUPABASE_URL),
    '__SUPABASE_ANON_KEY__': JSON.stringify(process.env.VITE_SUPABASE_ANON_KEY),
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    assetsDir: 'assets',
    sourcemap: true,
    minify: 'esbuild', // usando esbuild em vez de terser para simplificar
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'supabase': ['@supabase/supabase-js'],
          'ui': ['@radix-ui/react-*'],
        }
      }
    }
  },
  publicDir: 'public',
}));
