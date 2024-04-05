import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import dotenv from "dotenv";

dotenv.config();

export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    server: {
      watch: {
        usePolling: true,
      },
      host: "0.0.0.0",
      proxy: {
        "/socket": {
          target: process.env.VITE_SOCKET_URL,
          changeOrigin: true,
          ws: true,
        },
      },
    },
  };
});
