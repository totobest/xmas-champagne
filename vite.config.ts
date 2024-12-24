import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  build: {
    sourcemap: true,
  },
  css: {
    postcss: {
      plugins: [],
    },
  },
  plugins: [reactRouter(), tsconfigPaths()],
});
