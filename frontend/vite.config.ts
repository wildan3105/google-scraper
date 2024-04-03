import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,
    },
    host: "0.0.0.0",
    proxy: {
      "/socket": {
        target: "http://localhost:2000",
        changeOrigin: true,
        ws: true,
      },
    },
  },
});
