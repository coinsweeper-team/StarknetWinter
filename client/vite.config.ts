import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import topLevelAwait from "vite-plugin-top-level-await";
import wasm from "vite-plugin-wasm";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), wasm(), topLevelAwait()],
    server: {
        proxy: {
            // Proxy requests starting with /api to your backend server
            "/api": {
                target: "http://127.0.0.1:8080", // Backend server URL
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ""), // Optional, removes '/api' prefix
            },
        },
    },
});