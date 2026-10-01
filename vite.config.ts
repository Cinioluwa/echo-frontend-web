import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    dedupe: ["react", "react-dom", "react-router", "react-router-dom"],
    alias: {
      react: path.resolve(__dirname, "node_modules/react"),
      "react-dom": path.resolve(__dirname, "node_modules/react-dom"),
      "react-router-dom": path.resolve(__dirname, "node_modules/react-router-dom"),
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-router", "react-router-dom"],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (/[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) {
            return "react-vendor";
          }
          if (/[\\/]node_modules[\\/](recharts|d3-[^\\/]+)[\\/]/.test(id)) {
            return "charts-vendor";
          }
          if (/[\\/]node_modules[\\/]framer-motion[\\/]/.test(id)) {
            return "motion-vendor";
          }
        },
      },
    },
  },
});
