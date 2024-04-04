import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

import dotenv from "dotenv";

dotenv.config();

export default defineConfig(({ mode }) => {
  return {
    define: {
      __APP_ENV__: JSON.stringify(mode),
      __BACKEND_URL__: JSON.stringify(process.env.BACKEND_URL),
      __SOCKET_URL__: JSON.stringify(process.env.SOCKET_URL),
    },

    plugins: [react()],
    server: {
      watch: {
        usePolling: true,
      },
      host: "0.0.0.0",
      proxy: {
        "/socket": {
          target: process.env.SOCKET_URL,
          changeOrigin: true,
          ws: true,
        },
      },
    },
  };
});
