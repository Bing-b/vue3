import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path"; 
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'; // svg
// element-plus 按需自动导入
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'


const extensions: Array<string> = [".js", ".ts", ".jsx", ".tsx", ".json"];
const pathResolve = (dir: string): string => resolve(__dirname, dir);
const alias: Record<string, string> = {
  "@": pathResolve("./src"),
};


export const viteConfig = defineConfig(() => ({
  base: "/",
  plugins: [
    vue(),
    // svg注册
    createSvgIconsPlugin({
      iconDirs: [resolve(__dirname, './src/assets/icons')],
      symbolId: 'icon-[dir]-[name]',
    }),
    // el-plus 按需导入
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: { alias, extensions },
  server: {
    host: '0.0.0.0',
    // proxy: {
    //   '/upload': {
    //     target: 'http://127.0.0.1:4523/m1/1304360-0-default/minio/upload',
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/upload/, ''),
    //   },
    // },
  }
})) 

export default viteConfig;