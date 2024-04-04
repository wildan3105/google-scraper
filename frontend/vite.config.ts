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
        target: "http://localhost:2000", // TODO: load the base url from environment variable
        changeOrigin: true,
        ws: true,
      },
    },
  },
});
