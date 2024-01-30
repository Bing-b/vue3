// vite.config.ts
import { defineConfig } from "file:///E:/flyme/node_modules/.pnpm/vite@4.5.1_sass@1.69.7_terser@5.26.0/node_modules/vite/dist/node/index.js";
import vue from "file:///E:/flyme/node_modules/.pnpm/@vitejs+plugin-vue@4.6.2_vite@4.5.1_vue@3.4.15/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import { resolve } from "path";
import { createSvgIconsPlugin } from "file:///E:/flyme/node_modules/.pnpm/vite-plugin-svg-icons@2.0.1_vite@4.5.1/node_modules/vite-plugin-svg-icons/dist/index.mjs";
import AutoImport from "file:///E:/flyme/node_modules/.pnpm/unplugin-auto-import@0.15.3/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///E:/flyme/node_modules/.pnpm/unplugin-vue-components@0.24.1_vue@3.4.15/node_modules/unplugin-vue-components/dist/vite.mjs";
import { ElementPlusResolver } from "file:///E:/flyme/node_modules/.pnpm/unplugin-vue-components@0.24.1_vue@3.4.15/node_modules/unplugin-vue-components/dist/resolvers.mjs";
var __vite_injected_original_dirname = "E:\\flyme";
var extensions = [".js", ".ts", ".jsx", ".tsx", ".json"];
var pathResolve = (dir) => resolve(__vite_injected_original_dirname, dir);
var alias = {
  "@": pathResolve("./src")
};
var viteConfig = defineConfig(() => ({
  base: "/",
  plugins: [
    vue({
      script: {
        // 开启 defineModel
        defineModel: true
      }
    }),
    // svg注册
    createSvgIconsPlugin({
      iconDirs: [resolve(__vite_injected_original_dirname, "./src/assets/icons")],
      symbolId: "icon-[dir]-[name]"
    }),
    // el-plus 按需导入
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    })
  ],
  resolve: { alias, extensions },
  server: {
    host: "0.0.0.0",
    proxy: {
      "/tq": {
        target: "https://www.tianqiapi.com/api",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/tq/, "")
      },
      "/map": {
        target: "http://10.13.4.225:18081",
        rewrite: (path) => path.replace(/^\/map/, ""),
        changeOrigin: true
      }
    }
  },
  terserOptions: {
    compress: {
      drop_console: true,
      // 构建时去除console/debugger
      drop_debugger: true
    }
  }
}));
var vite_config_default = viteConfig;
export {
  vite_config_default as default,
  viteConfig
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxmbHltZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRTpcXFxcZmx5bWVcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0U6L2ZseW1lL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHZ1ZSBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tdnVlXCI7XHJcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tIFwicGF0aFwiOyBcclxuaW1wb3J0IHsgY3JlYXRlU3ZnSWNvbnNQbHVnaW4gfSBmcm9tICd2aXRlLXBsdWdpbi1zdmctaWNvbnMnOyAvLyBzdmdcclxuLy8gZWxlbWVudC1wbHVzIFx1NjMwOVx1OTcwMFx1ODFFQVx1NTJBOFx1NUJGQ1x1NTE2NVxyXG5pbXBvcnQgQXV0b0ltcG9ydCBmcm9tICd1bnBsdWdpbi1hdXRvLWltcG9ydC92aXRlJ1xyXG5pbXBvcnQgQ29tcG9uZW50cyBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy92aXRlJ1xyXG5pbXBvcnQgeyBFbGVtZW50UGx1c1Jlc29sdmVyIH0gZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvcmVzb2x2ZXJzJ1xyXG5cclxuXHJcbmNvbnN0IGV4dGVuc2lvbnM6IEFycmF5PHN0cmluZz4gPSBbXCIuanNcIiwgXCIudHNcIiwgXCIuanN4XCIsIFwiLnRzeFwiLCBcIi5qc29uXCJdO1xyXG5jb25zdCBwYXRoUmVzb2x2ZSA9IChkaXI6IHN0cmluZyk6IHN0cmluZyA9PiByZXNvbHZlKF9fZGlybmFtZSwgZGlyKTtcclxuY29uc3QgYWxpYXM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XHJcbiAgXCJAXCI6IHBhdGhSZXNvbHZlKFwiLi9zcmNcIiksXHJcbn07XHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IHZpdGVDb25maWcgPSBkZWZpbmVDb25maWcoKCkgPT4gKHtcclxuICBiYXNlOiBcIi9cIixcclxuICBwbHVnaW5zOiBbXHJcbiAgICB2dWUoe1xyXG4gICAgICBzY3JpcHQ6IHtcclxuICAgICAgICAvLyBcdTVGMDBcdTU0MkYgZGVmaW5lTW9kZWxcclxuICAgICAgICBkZWZpbmVNb2RlbDogdHJ1ZVxyXG4gICAgICB9XHJcbiAgICB9KSxcclxuICAgIC8vIHN2Z1x1NkNFOFx1NTE4Q1xyXG4gICAgY3JlYXRlU3ZnSWNvbnNQbHVnaW4oe1xyXG4gICAgICBpY29uRGlyczogW3Jlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvYXNzZXRzL2ljb25zJyldLFxyXG4gICAgICBzeW1ib2xJZDogJ2ljb24tW2Rpcl0tW25hbWVdJyxcclxuICAgIH0pLFxyXG4gICAgLy8gZWwtcGx1cyBcdTYzMDlcdTk3MDBcdTVCRkNcdTUxNjVcclxuICAgIEF1dG9JbXBvcnQoe1xyXG4gICAgICByZXNvbHZlcnM6IFtFbGVtZW50UGx1c1Jlc29sdmVyKCldLFxyXG4gICAgfSksXHJcbiAgICBDb21wb25lbnRzKHtcclxuICAgICAgcmVzb2x2ZXJzOiBbRWxlbWVudFBsdXNSZXNvbHZlcigpXSxcclxuICAgIH0pLFxyXG4gIF0sXHJcbiAgcmVzb2x2ZTogeyBhbGlhcywgZXh0ZW5zaW9ucyB9LFxyXG4gIHNlcnZlcjoge1xyXG4gICAgaG9zdDogJzAuMC4wLjAnLFxyXG4gICAgcHJveHk6IHtcclxuICAgICAgJy90cSc6IHtcclxuICAgICAgICB0YXJnZXQ6ICdodHRwczovL3d3dy50aWFucWlhcGkuY29tL2FwaScsXHJcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC90cS8sICcnKSxcclxuICAgICAgfSxcclxuICAgICAgJy9tYXAnOiB7XHJcbiAgICAgICAgdGFyZ2V0OiAnaHR0cDovLzEwLjEzLjQuMjI1OjE4MDgxJywgXHJcbiAgICAgICAgcmV3cml0ZTogcGF0aCA9PiBwYXRoLnJlcGxhY2UoL15cXC9tYXAvLCAnJyksXHJcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgfSxcclxuICB0ZXJzZXJPcHRpb25zOiB7XHJcbiAgICBjb21wcmVzczoge1xyXG4gICAgICBkcm9wX2NvbnNvbGU6IHRydWUsIC8vIFx1Njc4NFx1NUVGQVx1NjVGNlx1NTNCQlx1OTY2NGNvbnNvbGUvZGVidWdnZXJcclxuICAgICAgZHJvcF9kZWJ1Z2dlcjogdHJ1ZVxyXG4gICAgfVxyXG4gIH1cclxuICBcclxufSkpIFxyXG5cclxuZXhwb3J0IGRlZmF1bHQgdml0ZUNvbmZpZzsiXSwKICAibWFwcGluZ3MiOiAiO0FBQThNLFNBQVMsb0JBQW9CO0FBQzNPLE9BQU8sU0FBUztBQUNoQixTQUFTLGVBQWU7QUFDeEIsU0FBUyw0QkFBNEI7QUFFckMsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxnQkFBZ0I7QUFDdkIsU0FBUywyQkFBMkI7QUFQcEMsSUFBTSxtQ0FBbUM7QUFVekMsSUFBTSxhQUE0QixDQUFDLE9BQU8sT0FBTyxRQUFRLFFBQVEsT0FBTztBQUN4RSxJQUFNLGNBQWMsQ0FBQyxRQUF3QixRQUFRLGtDQUFXLEdBQUc7QUFDbkUsSUFBTSxRQUFnQztBQUFBLEVBQ3BDLEtBQUssWUFBWSxPQUFPO0FBQzFCO0FBR08sSUFBTSxhQUFhLGFBQWEsT0FBTztBQUFBLEVBQzVDLE1BQU07QUFBQSxFQUNOLFNBQVM7QUFBQSxJQUNQLElBQUk7QUFBQSxNQUNGLFFBQVE7QUFBQTtBQUFBLFFBRU4sYUFBYTtBQUFBLE1BQ2Y7QUFBQSxJQUNGLENBQUM7QUFBQTtBQUFBLElBRUQscUJBQXFCO0FBQUEsTUFDbkIsVUFBVSxDQUFDLFFBQVEsa0NBQVcsb0JBQW9CLENBQUM7QUFBQSxNQUNuRCxVQUFVO0FBQUEsSUFDWixDQUFDO0FBQUE7QUFBQSxJQUVELFdBQVc7QUFBQSxNQUNULFdBQVcsQ0FBQyxvQkFBb0IsQ0FBQztBQUFBLElBQ25DLENBQUM7QUFBQSxJQUNELFdBQVc7QUFBQSxNQUNULFdBQVcsQ0FBQyxvQkFBb0IsQ0FBQztBQUFBLElBQ25DLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxTQUFTLEVBQUUsT0FBTyxXQUFXO0FBQUEsRUFDN0IsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sT0FBTztBQUFBLE1BQ0wsT0FBTztBQUFBLFFBQ0wsUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLFFBQ2QsU0FBUyxDQUFDLFNBQVMsS0FBSyxRQUFRLFNBQVMsRUFBRTtBQUFBLE1BQzdDO0FBQUEsTUFDQSxRQUFRO0FBQUEsUUFDTixRQUFRO0FBQUEsUUFDUixTQUFTLFVBQVEsS0FBSyxRQUFRLFVBQVUsRUFBRTtBQUFBLFFBQzFDLGNBQWM7QUFBQSxNQUNoQjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxlQUFlO0FBQUEsSUFDYixVQUFVO0FBQUEsTUFDUixjQUFjO0FBQUE7QUFBQSxNQUNkLGVBQWU7QUFBQSxJQUNqQjtBQUFBLEVBQ0Y7QUFFRixFQUFFO0FBRUYsSUFBTyxzQkFBUTsiLAogICJuYW1lcyI6IFtdCn0K
