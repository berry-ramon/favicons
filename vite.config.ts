import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

// Vite config - https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const emitSourcemaps = mode === "development";

  return {
    base: "/",

    build: {
      sourcemap: emitSourcemaps ? "inline" : false,
      minify: !emitSourcemaps,
    },

    plugins: [react(), tailwindcss()],

    resolve: {
      alias: {
        // `import.meta.dirname` replaces `__dirname` for the native
        // config loader that Vite 8+ is migrating to.
        "@": path.resolve(import.meta.dirname, "./src"),
      },
    },

    server: {
      host: "0.0.0.0",
      port: 5174,
      strictPort: true,
    },

    preview: {
      host: "0.0.0.0",
      port: 4173,
    },
  };
});
