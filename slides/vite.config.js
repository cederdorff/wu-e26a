import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  root: resolve("slides"),
  base: "./",
  build: {
    outDir: resolve("dist/slides"),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: resolve("slides/index.html"),
        nodeExpress: resolve("slides/node-express/index.html"),
        expressEjs: resolve("slides/express-ejs/index.html")
      }
    }
  }
});
