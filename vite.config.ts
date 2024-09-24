import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import getApiAddress from "./getApiAddress";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: getApiAddress(),
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  plugins: [react()],
});
