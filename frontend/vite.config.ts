import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import dotenv from "dotenv";

dotenv.config();

export default defineConfig(({ mode }) => {
  return {
    define: {
      __APP_ENV__: JSON.stringify(mode),
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
