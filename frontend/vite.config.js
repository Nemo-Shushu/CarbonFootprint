import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/",
  plugins: [react()],
  preview: {
    port: 3000,
    strictPort: true,
  },
  server: {
    port: 3000,
    strictPort: true,
    host: true,
    origin: "http://localhost:3000",
    watch: {
      usePolling: true,
    },
    hmr: {
      host: "localhost",
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/Setup.jsx",
    coverage: {
      reporter: ["text", "lcov"],
      all: true,
      include: ["src/**/*.js", "src/**/*.jsx"],
      exclude: [
        "node_modules",
        "src/test/**",
        "vite.config.js",
        "src/features/**",
      ],
    },
  },
});
