// vite.config.ts
import { loadEnv } from "file:///E:/flyme/node_modules/.pnpm/vite@5.1.6_sass@1.42.1_terser@5.19.2/node_modules/vite/dist/node/index.js";

// build/utils.ts
import { resolve } from "path";

// package.json
var name = "flyme";
var version = "0.0.0";
var dependencies = {
  "@amap/amap-jsapi-loader": "^1.0.1",
  "@antv/g6": "^4.8.17",
  "@element-plus/icons-vue": "^2.1.0",
  axios: "^1.4.0",
  echarts: "^5.4.3",
  "echarts-gl": "^2.0.9",
  "element-plus": "^2.3.3",
  exceljs: "^4.3.0",
  "fake-progress": "^1.0.4",
  gcoord: "^0.3.2",
  "gdm-horizon": "^1.1.40",
  "intro.js": "^7.0.1",
  "label-studio": "^1.0.1",
  leaflet: "^1.9.4",
  "leaflet-draw": "^1.0.4",
  "leaflet-easyprint": "^2.1.9",
  "leaflet-measure": "^3.1.0",
  "leaflet-moving-marker": "^0.3.0",
  "leaflet-polylinedecorator": "^1.6.0",
  "leaflet.motion": "^0.3.2",
  lodash: "^4.17.21",
  "lottie-web": "^5.11.0",
  mitt: "^3.0.0",
  nprogress: "^0.2.0",
  "pdfjs-dist": "^3.7.107",
  pinia: "^2.1.4",
  "pinia-plugin-persist": "^1.0.0",
  "poplar-annotation": "^2.0.3",
  "postcss-preset-env": "^8.3.2",
  sortablejs: "^1.15.1",
  vue: "3.4.15",
  "vue-clipboard3": "^2.0.0",
  "vue-router": "^4.2.5",
  "vue-upload-component": "^3.1.8"
};
var devDependencies = {
  "@eslint/create-config": "^0.4.3",
  "@typescript-eslint/eslint-plugin": "^5.59.0",
  "@vitejs/plugin-vue": "^4.1.0",
  "ace-builds": "^1.19.0",
  autoprefixer: "^10.4.14",
  eslint: "^8.39.0",
  "eslint-config-prettier": "^8.8.0",
  "eslint-config-standard-with-typescript": "^34.0.1",
  "eslint-plugin-import": "^2.27.5",
  "eslint-plugin-n": "^15.7.0",
  "eslint-plugin-prettier": "^4.2.1",
  "eslint-plugin-promise": "^6.1.1",
  "eslint-plugin-vue": "^9.11.0",
  postcss: "^8.4.23",
  prettier: "^2.8.7",
  sass: "^1.42.1",
  "sass-loader": "^12.1.0",
  tailwindcss: "^3.3.1",
  terser: "^5.19.2",
  typescript: "^5.0.2",
  "unplugin-auto-import": "^0.15.3",
  "unplugin-vue-components": "^0.24.1",
  vite: "^5.1.6",
  "vite-plugin-svg-icons": "^2.0.1",
  "vue-eslint-parser": "^9.1.1",
  "vue-loader-v16": "16.0.0-beta.5.4",
  "vue-tsc": "^1.2.0"
};

// build/utils.ts
var __vite_injected_original_dirname = "E:\\flyme\\build";
var root = process.cwd();
var __APP_INFO__ = {
  pkg: { name, version, dependencies, devDependencies }
};
var pathResolve = (dir) => resolve(__vite_injected_original_dirname, dir);
var alias = {
  "@": pathResolve("../src")
};
var extensions = [".js", ".ts", ".jsx", ".tsx", ".json"];
var warpperEnv = (envConf) => {
  const ret = {
    VITE_PORT: 1234,
    VITE_PUBLIC_PATH: "/",
    VITE_CDN: false
  };
  for (const envName of Object.keys(envConf)) {
    let realName = envConf[envName].replace(/\\n/g, "\n");
    realName = realName === "true" ? true : realName === "false" ? false : realName;
    if (envName === "VITE_PORT")
      realName = Number(realName);
    ret[envName] = realName;
    if (typeof realName === "string") {
      process.env[envName] = realName;
    } else if (typeof realName === "object") {
      process.env[envName] = JSON.stringify(realName);
    }
  }
  return ret;
};

// build/plugins.ts
import vue from "file:///E:/flyme/node_modules/.pnpm/@vitejs+plugin-vue@4.1.0_vite@5.1.6_vue@3.4.15/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import { resolve as resolve2 } from "path";
import { createSvgIconsPlugin } from "file:///E:/flyme/node_modules/.pnpm/vite-plugin-svg-icons@2.0.1_vite@5.1.6/node_modules/vite-plugin-svg-icons/dist/index.mjs";
import AutoImport from "file:///E:/flyme/node_modules/.pnpm/unplugin-auto-import@0.15.3/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///E:/flyme/node_modules/.pnpm/unplugin-vue-components@0.24.1_vue@3.4.15/node_modules/unplugin-vue-components/dist/vite.mjs";
import { ElementPlusResolver } from "file:///E:/flyme/node_modules/.pnpm/unplugin-vue-components@0.24.1_vue@3.4.15/node_modules/unplugin-vue-components/dist/resolvers.mjs";
var __vite_injected_original_dirname2 = "E:\\flyme\\build";
var getPluginsList = () => {
  return [
    vue(),
    // svg注册
    createSvgIconsPlugin({
      iconDirs: [resolve2(__vite_injected_original_dirname2, "../src/assets/icons")],
      symbolId: "icon-[dir]-[name]"
    }),
    // el-plus 按需导入
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    })
  ];
};

// vite.config.ts
import { resolve as resolve3 } from "path";
var __vite_injected_original_dirname3 = "E:\\flyme";
var vite_config_default = ({ mode }) => {
  const { VITE_PORT, VITE_PUBLIC_PATH } = warpperEnv(loadEnv(mode, root));
  return {
    base: VITE_PUBLIC_PATH,
    root,
    resolve: {
      alias,
      // 设置系统路径别名
      extensions
    },
    // 服务端渲染
    server: {
      port: VITE_PORT,
      host: "0.0.0.0",
      proxy: {
        "/tq": {
          target: "https://www.tianqiapi.com/api",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/tq/, "")
        }
      },
      // 预热文件以提前转换和缓存结果，降低启动期间的初始页面加载时长并防止转换瀑布
      warmup: {
        clientFiles: ["./index.html", "./src/{views,components}/*"]
      }
    },
    plugins: getPluginsList(),
    build: {
      // https://cn.vitejs.dev/guide/build.html#browser-compatibility
      target: "es2015",
      sourcemap: false,
      // 消除打包大小超过500kb警告
      chunkSizeWarningLimit: 4e3,
      rollupOptions: {
        input: {
          main: resolve3(__vite_injected_original_dirname3, "index.html")
        },
        // 静态资源分类打包
        output: {
          chunkFileNames: "static/js/[name]-[hash].js",
          entryFileNames: "static/js/[name]-[hash].js",
          assetFileNames: "static/[ext]/[name]-[hash].[ext]"
        }
      }
    },
    define: {
      __INTLIFY_PROD_DEVTOOLS__: false,
      __APP_INFO__: JSON.stringify(__APP_INFO__)
    }
  };
};
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAiYnVpbGQvdXRpbHMudHMiLCAicGFja2FnZS5qc29uIiwgImJ1aWxkL3BsdWdpbnMudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxmbHltZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRTpcXFxcZmx5bWVcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0U6L2ZseW1lL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgQ29uZmlnRW52LCBVc2VyQ29uZmlnRXhwb3J0LCBsb2FkRW52IH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHsgX19BUFBfSU5GT19fLCBhbGlhcywgZXh0ZW5zaW9ucywgcm9vdCwgd2FycHBlckVudiB9IGZyb20gXCIuL2J1aWxkL3V0aWxzXCI7XHJcbmltcG9ydCB7IGdldFBsdWdpbnNMaXN0IH0gZnJvbSBcIi4vYnVpbGQvcGx1Z2luc1wiO1xyXG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSBcInBhdGhcIjsgXHJcblxyXG5leHBvcnQgZGVmYXVsdCAoeyBtb2RlIH06Q29uZmlnRW52KTogVXNlckNvbmZpZ0V4cG9ydCA9PiB7XHJcbiAgLy8gXHU3M0FGXHU1ODgzXHU1M0Q4XHU5MUNGXHJcbiAgY29uc3QgeyBWSVRFX1BPUlQsIFZJVEVfUFVCTElDX1BBVEh9ID0gd2FycHBlckVudihsb2FkRW52KG1vZGUsIHJvb3QpKTtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGJhc2U6IFZJVEVfUFVCTElDX1BBVEgsXHJcbiAgICByb290LFxyXG4gICAgcmVzb2x2ZToge1xyXG4gICAgICBhbGlhcywgLy8gXHU4QkJFXHU3RjZFXHU3Q0ZCXHU3RURGXHU4REVGXHU1Rjg0XHU1MjJCXHU1NDBEXHJcbiAgICAgIGV4dGVuc2lvbnNcclxuICAgIH0sXHJcbiAgICAvLyBcdTY3MERcdTUyQTFcdTdBRUZcdTZFMzJcdTY3RDNcclxuICAgIHNlcnZlcjoge1xyXG4gICAgICBwb3J0OiBWSVRFX1BPUlQsXHJcbiAgICAgIGhvc3Q6IFwiMC4wLjAuMFwiLFxyXG4gICAgICBwcm94eToge1xyXG4gICAgICAgICcvdHEnOiB7XHJcbiAgICAgICAgICB0YXJnZXQ6ICdodHRwczovL3d3dy50aWFucWlhcGkuY29tL2FwaScsXHJcbiAgICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKC9eXFwvdHEvLCAnJyksXHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgICAgIC8vIFx1OTg4NFx1NzBFRFx1NjU4N1x1NEVGNlx1NEVFNVx1NjNEMFx1NTI0RFx1OEY2Q1x1NjM2Mlx1NTQ4Q1x1N0YxM1x1NUI1OFx1N0VEM1x1Njc5Q1x1RkYwQ1x1OTY0RFx1NEY0RVx1NTQyRlx1NTJBOFx1NjcxRlx1OTVGNFx1NzY4NFx1NTIxRFx1NTlDQlx1OTg3NVx1OTc2Mlx1NTJBMFx1OEY3RFx1NjVGNlx1OTU3Rlx1NUU3Nlx1OTYzMlx1NkI2Mlx1OEY2Q1x1NjM2Mlx1NzAxMVx1NUUwM1xyXG4gICAgICAgd2FybXVwOiB7XHJcbiAgICAgICAgY2xpZW50RmlsZXM6IFtcIi4vaW5kZXguaHRtbFwiLCBcIi4vc3JjL3t2aWV3cyxjb21wb25lbnRzfS8qXCJdXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBwbHVnaW5zOiBnZXRQbHVnaW5zTGlzdCgpLFxyXG4gICAgYnVpbGQ6IHtcclxuICAgICAgLy8gaHR0cHM6Ly9jbi52aXRlanMuZGV2L2d1aWRlL2J1aWxkLmh0bWwjYnJvd3Nlci1jb21wYXRpYmlsaXR5XHJcbiAgICAgIHRhcmdldDogXCJlczIwMTVcIixcclxuICAgICAgc291cmNlbWFwOiBmYWxzZSxcclxuICAgICAgLy8gXHU2RDg4XHU5NjY0XHU2MjUzXHU1MzA1XHU1OTI3XHU1QzBGXHU4RDg1XHU4RkM3NTAwa2JcdThCNjZcdTU0NEFcclxuICAgICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiA0MDAwLFxyXG4gICAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgICAgaW5wdXQ6IHtcclxuICAgICAgICAgIG1haW46IHJlc29sdmUoX19kaXJuYW1lLCAnaW5kZXguaHRtbCcpLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy8gXHU5NzU5XHU2MDAxXHU4RDQ0XHU2RTkwXHU1MjA2XHU3QzdCXHU2MjUzXHU1MzA1XHJcbiAgICAgICAgb3V0cHV0OiB7XHJcbiAgICAgICAgICBjaHVua0ZpbGVOYW1lczogXCJzdGF0aWMvanMvW25hbWVdLVtoYXNoXS5qc1wiLFxyXG4gICAgICAgICAgZW50cnlGaWxlTmFtZXM6IFwic3RhdGljL2pzL1tuYW1lXS1baGFzaF0uanNcIixcclxuICAgICAgICAgIGFzc2V0RmlsZU5hbWVzOiBcInN0YXRpYy9bZXh0XS9bbmFtZV0tW2hhc2hdLltleHRdXCJcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBkZWZpbmU6IHtcclxuICAgICAgX19JTlRMSUZZX1BST0RfREVWVE9PTFNfXzogZmFsc2UsXHJcbiAgICAgIF9fQVBQX0lORk9fXzogSlNPTi5zdHJpbmdpZnkoX19BUFBfSU5GT19fKVxyXG4gICAgfVxyXG4gIH1cclxufSIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRTpcXFxcZmx5bWVcXFxcYnVpbGRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkU6XFxcXGZseW1lXFxcXGJ1aWxkXFxcXHV0aWxzLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9FOi9mbHltZS9idWlsZC91dGlscy50c1wiO1xyXG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSBcInBhdGhcIjsgXHJcbmltcG9ydCB7XHJcbiAgbmFtZSxcclxuICB2ZXJzaW9uLFxyXG4gIGRlcGVuZGVuY2llcyxcclxuICBkZXZEZXBlbmRlbmNpZXNcclxufSBmcm9tIFwiLi4vcGFja2FnZS5qc29uXCI7XHJcblxyXG5cclxuLyoqIFx1NTQyRlx1NTJBOGBub2RlYFx1OEZEQlx1N0EwQlx1NjVGNlx1NjI0MFx1NTcyOFx1NURFNVx1NEY1Q1x1NzZFRVx1NUY1NVx1NzY4NFx1N0VERFx1NUJGOVx1OERFRlx1NUY4NCAqL1xyXG5jb25zdCByb290OiBzdHJpbmcgPSBwcm9jZXNzLmN3ZCgpO1xyXG5cclxuLyoqIFx1NUU3M1x1NTNGMFx1NzY4NFx1NTQwRFx1NzlGMFx1MzAwMVx1NzI0OFx1NjcyQ1x1MzAwMVx1OEZEMFx1ODg0Q1x1NjI0MFx1OTcwMFx1NzY4NGBub2RlYFx1NTQ4Q2BwbnBtYFx1NzI0OFx1NjcyQ1x1MzAwMVx1NEY5RFx1OEQ1Nlx1MzAwMVx1NjcwMFx1NTQwRVx1Njc4NFx1NUVGQVx1NjVGNlx1OTVGNFx1NzY4NFx1N0M3Qlx1NTc4Qlx1NjNEMFx1NzkzQSAqL1xyXG5jb25zdCBfX0FQUF9JTkZPX18gPSB7XHJcbiAgcGtnOiB7IG5hbWUsIHZlcnNpb24sIGRlcGVuZGVuY2llcywgZGV2RGVwZW5kZW5jaWVzIH0sXHJcbn07XHJcblxyXG4vKiogXHU4QkJFXHU3RjZFXHU1MjJCXHU1NDBEICovXHJcbmNvbnN0IHBhdGhSZXNvbHZlID0gKGRpcjogc3RyaW5nKTogc3RyaW5nID0+IHJlc29sdmUoX19kaXJuYW1lLCBkaXIpO1xyXG5jb25zdCBhbGlhczogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcclxuICBcIkBcIjogcGF0aFJlc29sdmUoXCIuLi9zcmNcIiksXHJcbn07XHJcblxyXG4vKiogXHU1QkZDXHU1MTY1XHU2NTg3XHU0RUY2XHU2NUY2XHU2MEYzXHU4OTgxXHU3NzAxXHU3NTY1XHU3Njg0XHU2MjY5XHU1QzU1XHU1NDBEXHU1MjE3XHU4ODY4ICovXHJcbmNvbnN0IGV4dGVuc2lvbnM6IEFycmF5PHN0cmluZz4gPSBbXCIuanNcIiwgXCIudHNcIiwgXCIuanN4XCIsIFwiLnRzeFwiLCBcIi5qc29uXCJdO1xyXG5cclxuLyoqIFx1NTkwNFx1NzQwNlx1NzNBRlx1NTg4M1x1NTNEOFx1OTFDRiAqL1xyXG5jb25zdCB3YXJwcGVyRW52ID0gKGVudkNvbmY6IFJlY29yZGFibGUpOiBWaXRlRW52ID0+IHtcclxuICBjb25zdCByZXQ6IFZpdGVFbnYgPSB7XHJcbiAgICBWSVRFX1BPUlQ6IDEyMzQsXHJcbiAgICBWSVRFX1BVQkxJQ19QQVRIOiAnLycsXHJcbiAgICBWSVRFX0NETjogZmFsc2UsXHJcbiAgfVxyXG5cclxuICBmb3IoY29uc3QgZW52TmFtZSBvZiBPYmplY3Qua2V5cyhlbnZDb25mKSkge1xyXG4gICAgbGV0IHJlYWxOYW1lID0gZW52Q29uZltlbnZOYW1lXS5yZXBsYWNlKC9cXFxcbi9nLCBcIlxcblwiKTtcclxuICAgIHJlYWxOYW1lID0gcmVhbE5hbWUgPT09IFwidHJ1ZVwiID8gdHJ1ZTogcmVhbE5hbWUgPT09IFwiZmFsc2VcIiA/IGZhbHNlIDogcmVhbE5hbWU7XHJcbiAgICBpZiAoZW52TmFtZSA9PT0gJ1ZJVEVfUE9SVCcpIHJlYWxOYW1lID0gTnVtYmVyKHJlYWxOYW1lKTtcclxuICAgIHJldFtlbnZOYW1lXSA9IHJlYWxOYW1lO1xyXG4gICAgaWYgKHR5cGVvZiByZWFsTmFtZSA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgcHJvY2Vzcy5lbnZbZW52TmFtZV0gPSByZWFsTmFtZTtcclxuICAgIH1lbHNlIGlmICh0eXBlb2YgcmVhbE5hbWUgPT09ICdvYmplY3QnKSB7XHJcbiAgICAgIHByb2Nlc3MuZW52W2Vudk5hbWVdID0gSlNPTi5zdHJpbmdpZnkocmVhbE5hbWUpXHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiByZXRcclxufVxyXG5cclxuZXhwb3J0IHsgcm9vdCwgYWxpYXMsICBleHRlbnNpb25zLCB3YXJwcGVyRW52LCBwYXRoUmVzb2x2ZSwgX19BUFBfSU5GT19ffVxyXG5cclxuXHJcbiIsICJ7XG4gIFwibmFtZVwiOiBcImZseW1lXCIsXG4gIFwicHJpdmF0ZVwiOiB0cnVlLFxuICBcInZlcnNpb25cIjogXCIwLjAuMFwiLFxuICBcInR5cGVcIjogXCJtb2R1bGVcIixcbiAgXCJzY3JpcHRzXCI6IHtcbiAgICBcImRldlwiOiBcInZpdGUgLS1vcGVuXCIsXG4gICAgXCJzZXJ2ZVwiOiBcInBucG0gZGV2XCIsXG4gICAgXCJidWlsZFwiOiBcInZpdGUgYnVpbGRcIlxuICB9LFxuICBcImRlcGVuZGVuY2llc1wiOiB7XG4gICAgXCJAYW1hcC9hbWFwLWpzYXBpLWxvYWRlclwiOiBcIl4xLjAuMVwiLFxuICAgIFwiQGFudHYvZzZcIjogXCJeNC44LjE3XCIsXG4gICAgXCJAZWxlbWVudC1wbHVzL2ljb25zLXZ1ZVwiOiBcIl4yLjEuMFwiLFxuICAgIFwiYXhpb3NcIjogXCJeMS40LjBcIixcbiAgICBcImVjaGFydHNcIjogXCJeNS40LjNcIixcbiAgICBcImVjaGFydHMtZ2xcIjogXCJeMi4wLjlcIixcbiAgICBcImVsZW1lbnQtcGx1c1wiOiBcIl4yLjMuM1wiLFxuICAgIFwiZXhjZWxqc1wiOiBcIl40LjMuMFwiLFxuICAgIFwiZmFrZS1wcm9ncmVzc1wiOiBcIl4xLjAuNFwiLFxuICAgIFwiZ2Nvb3JkXCI6IFwiXjAuMy4yXCIsXG4gICAgXCJnZG0taG9yaXpvblwiOiBcIl4xLjEuNDBcIixcbiAgICBcImludHJvLmpzXCI6IFwiXjcuMC4xXCIsXG4gICAgXCJsYWJlbC1zdHVkaW9cIjogXCJeMS4wLjFcIixcbiAgICBcImxlYWZsZXRcIjogXCJeMS45LjRcIixcbiAgICBcImxlYWZsZXQtZHJhd1wiOiBcIl4xLjAuNFwiLFxuICAgIFwibGVhZmxldC1lYXN5cHJpbnRcIjogXCJeMi4xLjlcIixcbiAgICBcImxlYWZsZXQtbWVhc3VyZVwiOiBcIl4zLjEuMFwiLFxuICAgIFwibGVhZmxldC1tb3ZpbmctbWFya2VyXCI6IFwiXjAuMy4wXCIsXG4gICAgXCJsZWFmbGV0LXBvbHlsaW5lZGVjb3JhdG9yXCI6IFwiXjEuNi4wXCIsXG4gICAgXCJsZWFmbGV0Lm1vdGlvblwiOiBcIl4wLjMuMlwiLFxuICAgIFwibG9kYXNoXCI6IFwiXjQuMTcuMjFcIixcbiAgICBcImxvdHRpZS13ZWJcIjogXCJeNS4xMS4wXCIsXG4gICAgXCJtaXR0XCI6IFwiXjMuMC4wXCIsXG4gICAgXCJucHJvZ3Jlc3NcIjogXCJeMC4yLjBcIixcbiAgICBcInBkZmpzLWRpc3RcIjogXCJeMy43LjEwN1wiLFxuICAgIFwicGluaWFcIjogXCJeMi4xLjRcIixcbiAgICBcInBpbmlhLXBsdWdpbi1wZXJzaXN0XCI6IFwiXjEuMC4wXCIsXG4gICAgXCJwb3BsYXItYW5ub3RhdGlvblwiOiBcIl4yLjAuM1wiLFxuICAgIFwicG9zdGNzcy1wcmVzZXQtZW52XCI6IFwiXjguMy4yXCIsXG4gICAgXCJzb3J0YWJsZWpzXCI6IFwiXjEuMTUuMVwiLFxuICAgIFwidnVlXCI6IFwiMy40LjE1XCIsXG4gICAgXCJ2dWUtY2xpcGJvYXJkM1wiOiBcIl4yLjAuMFwiLFxuICAgIFwidnVlLXJvdXRlclwiOiBcIl40LjIuNVwiLFxuICAgIFwidnVlLXVwbG9hZC1jb21wb25lbnRcIjogXCJeMy4xLjhcIlxuICB9LFxuICBcImRldkRlcGVuZGVuY2llc1wiOiB7XG4gICAgXCJAZXNsaW50L2NyZWF0ZS1jb25maWdcIjogXCJeMC40LjNcIixcbiAgICBcIkB0eXBlc2NyaXB0LWVzbGludC9lc2xpbnQtcGx1Z2luXCI6IFwiXjUuNTkuMFwiLFxuICAgIFwiQHZpdGVqcy9wbHVnaW4tdnVlXCI6IFwiXjQuMS4wXCIsXG4gICAgXCJhY2UtYnVpbGRzXCI6IFwiXjEuMTkuMFwiLFxuICAgIFwiYXV0b3ByZWZpeGVyXCI6IFwiXjEwLjQuMTRcIixcbiAgICBcImVzbGludFwiOiBcIl44LjM5LjBcIixcbiAgICBcImVzbGludC1jb25maWctcHJldHRpZXJcIjogXCJeOC44LjBcIixcbiAgICBcImVzbGludC1jb25maWctc3RhbmRhcmQtd2l0aC10eXBlc2NyaXB0XCI6IFwiXjM0LjAuMVwiLFxuICAgIFwiZXNsaW50LXBsdWdpbi1pbXBvcnRcIjogXCJeMi4yNy41XCIsXG4gICAgXCJlc2xpbnQtcGx1Z2luLW5cIjogXCJeMTUuNy4wXCIsXG4gICAgXCJlc2xpbnQtcGx1Z2luLXByZXR0aWVyXCI6IFwiXjQuMi4xXCIsXG4gICAgXCJlc2xpbnQtcGx1Z2luLXByb21pc2VcIjogXCJeNi4xLjFcIixcbiAgICBcImVzbGludC1wbHVnaW4tdnVlXCI6IFwiXjkuMTEuMFwiLFxuICAgIFwicG9zdGNzc1wiOiBcIl44LjQuMjNcIixcbiAgICBcInByZXR0aWVyXCI6IFwiXjIuOC43XCIsXG4gICAgXCJzYXNzXCI6IFwiXjEuNDIuMVwiLFxuICAgIFwic2Fzcy1sb2FkZXJcIjogXCJeMTIuMS4wXCIsXG4gICAgXCJ0YWlsd2luZGNzc1wiOiBcIl4zLjMuMVwiLFxuICAgIFwidGVyc2VyXCI6IFwiXjUuMTkuMlwiLFxuICAgIFwidHlwZXNjcmlwdFwiOiBcIl41LjAuMlwiLFxuICAgIFwidW5wbHVnaW4tYXV0by1pbXBvcnRcIjogXCJeMC4xNS4zXCIsXG4gICAgXCJ1bnBsdWdpbi12dWUtY29tcG9uZW50c1wiOiBcIl4wLjI0LjFcIixcbiAgICBcInZpdGVcIjogXCJeNS4xLjZcIixcbiAgICBcInZpdGUtcGx1Z2luLXN2Zy1pY29uc1wiOiBcIl4yLjAuMVwiLFxuICAgIFwidnVlLWVzbGludC1wYXJzZXJcIjogXCJeOS4xLjFcIixcbiAgICBcInZ1ZS1sb2FkZXItdjE2XCI6IFwiMTYuMC4wLWJldGEuNS40XCIsXG4gICAgXCJ2dWUtdHNjXCI6IFwiXjEuMi4wXCJcbiAgfVxufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxmbHltZVxcXFxidWlsZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRTpcXFxcZmx5bWVcXFxcYnVpbGRcXFxccGx1Z2lucy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRTovZmx5bWUvYnVpbGQvcGx1Z2lucy50c1wiO2ltcG9ydCB7IFBsdWdpbk9wdGlvbiB9IGZyb20gXCJ2aXRlXCI7XHJcbmltcG9ydCB2dWUgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXZ1ZVwiO1xyXG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSBcInBhdGhcIjsgXHJcbmltcG9ydCB7IGNyZWF0ZVN2Z0ljb25zUGx1Z2luIH0gZnJvbSBcInZpdGUtcGx1Z2luLXN2Zy1pY29uc1wiO1xyXG5pbXBvcnQgQXV0b0ltcG9ydCBmcm9tICd1bnBsdWdpbi1hdXRvLWltcG9ydC92aXRlJ1xyXG5pbXBvcnQgQ29tcG9uZW50cyBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy92aXRlJ1xyXG5pbXBvcnQgeyBFbGVtZW50UGx1c1Jlc29sdmVyIH0gZnJvbSBcInVucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3Jlc29sdmVyc1wiO1xyXG5cclxuLyoqIFx1ODNCN1x1NTNENlx1NjNEMlx1NEVGNlx1NTIxN1x1ODg2OCAqL1xyXG5leHBvcnQgY29uc3QgZ2V0UGx1Z2luc0xpc3QgPSAoKTogQXJyYXk8UGx1Z2luT3B0aW9uPiAgPT4ge1xyXG4gIHJldHVybiBbXHJcbiAgICB2dWUoKSxcclxuICAgICAvLyBzdmdcdTZDRThcdTUxOENcclxuICAgICBjcmVhdGVTdmdJY29uc1BsdWdpbih7XHJcbiAgICAgIGljb25EaXJzOiBbcmVzb2x2ZShfX2Rpcm5hbWUsICcuLi9zcmMvYXNzZXRzL2ljb25zJyldLFxyXG4gICAgICBzeW1ib2xJZDogJ2ljb24tW2Rpcl0tW25hbWVdJyxcclxuICAgIH0pLFxyXG4gICAgLy8gZWwtcGx1cyBcdTYzMDlcdTk3MDBcdTVCRkNcdTUxNjVcclxuICAgIEF1dG9JbXBvcnQoe1xyXG4gICAgICByZXNvbHZlcnM6IFtFbGVtZW50UGx1c1Jlc29sdmVyKCldLFxyXG4gICAgfSksXHJcbiAgICBDb21wb25lbnRzKHtcclxuICAgICAgcmVzb2x2ZXJzOiBbRWxlbWVudFBsdXNSZXNvbHZlcigpXSxcclxuICAgIH0pLFxyXG4gIF1cclxufSJdLAogICJtYXBwaW5ncyI6ICI7QUFBOE0sU0FBc0MsZUFBZTs7O0FDQ25RLFNBQVMsZUFBZTs7O0FDQXRCLFdBQVE7QUFFUixjQUFXO0FBT1gsbUJBQWdCO0FBQUEsRUFDZCwyQkFBMkI7QUFBQSxFQUMzQixZQUFZO0FBQUEsRUFDWiwyQkFBMkI7QUFBQSxFQUMzQixPQUFTO0FBQUEsRUFDVCxTQUFXO0FBQUEsRUFDWCxjQUFjO0FBQUEsRUFDZCxnQkFBZ0I7QUFBQSxFQUNoQixTQUFXO0FBQUEsRUFDWCxpQkFBaUI7QUFBQSxFQUNqQixRQUFVO0FBQUEsRUFDVixlQUFlO0FBQUEsRUFDZixZQUFZO0FBQUEsRUFDWixnQkFBZ0I7QUFBQSxFQUNoQixTQUFXO0FBQUEsRUFDWCxnQkFBZ0I7QUFBQSxFQUNoQixxQkFBcUI7QUFBQSxFQUNyQixtQkFBbUI7QUFBQSxFQUNuQix5QkFBeUI7QUFBQSxFQUN6Qiw2QkFBNkI7QUFBQSxFQUM3QixrQkFBa0I7QUFBQSxFQUNsQixRQUFVO0FBQUEsRUFDVixjQUFjO0FBQUEsRUFDZCxNQUFRO0FBQUEsRUFDUixXQUFhO0FBQUEsRUFDYixjQUFjO0FBQUEsRUFDZCxPQUFTO0FBQUEsRUFDVCx3QkFBd0I7QUFBQSxFQUN4QixxQkFBcUI7QUFBQSxFQUNyQixzQkFBc0I7QUFBQSxFQUN0QixZQUFjO0FBQUEsRUFDZCxLQUFPO0FBQUEsRUFDUCxrQkFBa0I7QUFBQSxFQUNsQixjQUFjO0FBQUEsRUFDZCx3QkFBd0I7QUFDMUI7QUFDQSxzQkFBbUI7QUFBQSxFQUNqQix5QkFBeUI7QUFBQSxFQUN6QixvQ0FBb0M7QUFBQSxFQUNwQyxzQkFBc0I7QUFBQSxFQUN0QixjQUFjO0FBQUEsRUFDZCxjQUFnQjtBQUFBLEVBQ2hC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QUFBLFVBQ1IsY0FBYztBQUFBLFVBQ2QsU0FBUyxDQUFDLFNBQVMsS0FBSyxRQUFRLFNBQVMsRUFBRTtBQUFBLFFBQzdDO0FBQUEsTUFDRjtBQUFBO0FBQUEsTUFFQyxRQUFRO0FBQUEsUUFDUCxhQUFhLENBQUMsZ0JBQWdCLDRCQUE0QjtBQUFBLE1BQzVEO0FBQUEsSUFDRjtBQUFBLElBQ0EsU0FBUyxlQUFlO0FBQUEsSUFDeEIsT0FBTztBQUFBO0FBQUEsTUFFTCxRQUFRO0FBQUEsTUFDUixXQUFXO0FBQUE7QUFBQSxNQUVYLHVCQUF1QjtBQUFBLE1BQ3ZCLGVBQWU7QUFBQSxRQUNiLE9BQU87QUFBQSxVQUNMLE1BQU1DLFNBQVFDLG1DQUFXLFlBQVk7QUFBQSxRQUN2QztBQUFBO0FBQUEsUUFFQSxRQUFRO0FBQUEsVUFDTixnQkFBZ0I7QUFBQSxVQUNoQixnQkFBZ0I7QUFBQSxVQUNoQixnQkFBZ0I7QUFBQSxRQUNsQjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsSUFDQSxRQUFRO0FBQUEsTUFDTiwyQkFBMkI7QUFBQSxNQUMzQixjQUFjLEtBQUssVUFBVSxZQUFZO0FBQUEsSUFDM0M7QUFBQSxFQUNGO0FBQ0Y7IiwKICAibmFtZXMiOiBbInJlc29sdmUiLCAiX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUiLCAicmVzb2x2ZSIsICJfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSIsICJyZXNvbHZlIiwgIl9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lIiwgInJlc29sdmUiLCAiX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUiXQp9Cg==
