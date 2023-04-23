import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import { resolve } from "path";

const extensions: Array<string> = [".js", ".ts", ".jsx", ".tsx", ".json"];
const pathResolve = (dir: string): string => resolve(__dirname, dir);
const alias: Record<string, string> = {
  "@": pathResolve("./src"),
};

export default defineConfig({
  base: "/",
  plugins: [vue()],
  resolve: { alias, extensions },
});
