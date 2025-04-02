import { defineConfig, loadEnv } from "vite"; // Import loadEnv
import react from "@vitejs/plugin-react";

// Use Vite's loadEnv function to correctly load env variables based on mode
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  // Convert port to number, provide default if not set
  const port = parseInt(env.FRONTEND_PORT || '80', 10);

  // Use loaded variables
  const FRONTEND_PORT = port;
  const FRONTEND_HOST = env.FRONTEND_HOST || 'localhost';
  const FRONTEND_URL = env.FRONTEND_URL || `http://${FRONTEND_HOST}:${FRONTEND_PORT}`;

  return {
    base: "/",
    plugins: [react()],
    preview: {
      port: FRONTEND_PORT,
      strictPort: true,
    },
    server: {
      port: FRONTEND_PORT,
      strictPort: true,
      host: true,
      origin: FRONTEND_URL,
      watch: {
        usePolling: true,
      },
      hmr: {
        host: FRONTEND_HOST,
      },
    },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/test/Setup.jsx",
      coverage: {
        reporter: ["text", "lcov"],
        all: true,
        include: [
          "src/**/*.js",
          "src/**/*.jsx",
          "src/features/ManageFactors/components/**/*.jsx",
        ],
        exclude: [
          "node_modules",
          "dist",
          ".*",
          "vite.config.js",
          "src/test/Setup.jsx",
          "src/main.jsx",
          "src/features/ManageFactors/api",
          "src/setupTests.jsx",
        ],
      },
    },
  };
});