import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import fs from "fs";

const copyManifest = () => {
  return {
    name: "copy-manifest",
    writeBundle() {
      fs.copyFileSync("manifest.json", "dist/manifest.json");
    },
  };
};

export default defineConfig({
  plugins: [react(), copyManifest()],
  define: {
    global: "globalThis",
  },
  build: {
    outDir: "dist",
    minify: false, // Easier for debugging
    sourcemap: true,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "src/index.jsx"),
        background: resolve(__dirname, "background.js"),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          return chunkInfo.name === "background" ? "[name].js" : "popup.js";
        },
        chunkFileNames: "assets/[name].js",
        assetFileNames: "assets/[name].[ext]",
      },
    },
  },
  server: {
    port: 3000,
    hmr: {
      port: 3001,
    },
  },
  publicDir: "public",
});
