// vite.config.ts
import { loadEnv } from "file:///E:/flyme/node_modules/.pnpm/vite@5.4.14_@types+node@22.13.4_sass@1.85.0_terser@5.39.0/node_modules/vite/dist/node/index.js";

// build/utils.ts
import { resolve } from "path";

// package.json
var name = "agerars";
var version = "1.1.0";
var dependencies = {
  "@amap/amap-jsapi-loader": "^1.0.1",
  "@antv/g6": "^4.8.17",
  "@barba/core": "^2.10.3",
  "@element-plus/icons-vue": "^2.1.0",
  "@tailwindcss/vite": "^4.0.17",
  "@vue-flow/background": "^1.3.0",
  "@vue-flow/controls": "^1.1.1",
  "@vue-flow/core": "^1.33.5",
  "@vue-flow/minimap": "^1.4.0",
  "@vueuse/core": "^10.11.0",
  axios: "^1.4.0",
  "canvas-confetti": "^1.9.3",
  dayjs: "^1.11.13",
  echarts: "^5.4.3",
  "echarts-gl": "^2.0.9",
  "element-plus": "^2.3.3",
  "es-toolkit": "^1.13.1",
  exceljs: "^4.3.0",
  "fake-progress": "^1.0.4",
  gcoord: "^0.3.2",
  gsap: "^3.12.5",
  "intro.js": "^7.0.1",
  "label-studio": "^1.0.1",
  leaflet: "^1.9.4",
  "leaflet-ant-path": "^1.3.0",
  "leaflet-boundary-canvas": "^1.0.0",
  "leaflet-control-mini-map": "^0.4.0",
  "leaflet-draw": "^1.0.4",
  "leaflet-easyprint": "^2.1.9",
  "leaflet-measure": "^3.1.0",
  "leaflet-moving-marker": "^0.3.0",
  "leaflet-polylinedecorator": "^1.6.0",
  "leaflet-pulse-icon": "^0.1.0",
  "leaflet.fullscreen": "^3.0.1",
  "leaflet.motion": "^0.3.2",
  "lottie-web": "^5.11.0",
  mitt: "^3.0.0",
  nanoid: "^5.0.7",
  nprogress: "^0.2.0",
  "p-limit": "^6.1.0",
  "pdfjs-dist": "^3.7.107",
  pinia: "^2.1.4",
  "pinia-plugin-persist": "^1.0.0",
  "poplar-annotation": "^2.0.3",
  sortablejs: "^1.15.6",
  tailwindcss: "^4.0.17",
  three: "^0.169.0",
  vue: "3.5.10",
  "vue-clipboard3": "^2.0.0",
  "vue-echarts": "^6.7.3",
  "vue-pdf-embed": "^2.0.4",
  "vue-router": "^4.2.5",
  "vue-upload-component": "^3.1.8",
  "vue-virtual-scroller": "2.0.0-beta.8"
};
var devDependencies = {
  "@eslint/create-config": "^0.4.3",
  "@types/leaflet": "^1.9.14",
  "@typescript-eslint/eslint-plugin": "^5.59.0",
  "@vitejs/plugin-vue": "^4.1.0",
  "@vueuse/motion": "^2.1.0",
  "ace-builds": "^1.19.0",
  autoprefixer: "^10.4.14",
  commitizen: "^4.3.0",
  "cz-customizable": "^7.2.1",
  eslint: "^8.39.0",
  "eslint-config-prettier": "^8.8.0",
  "eslint-config-standard-with-typescript": "^34.0.1",
  "eslint-plugin-import": "^2.27.5",
  "eslint-plugin-n": "^15.7.0",
  "eslint-plugin-prettier": "^4.2.1",
  "eslint-plugin-promise": "^6.1.1",
  "eslint-plugin-vue": "^9.11.0",
  prettier: "^3.5.3",
  "prettier-plugin-tailwindcss": "^0.6.11",
  "rollup-plugin-visualizer": "^5.12.0",
  sass: "^1.42.1",
  "sass-loader": "^12.1.0",
  terser: "^5.19.2",
  typescript: "^5.0.2",
  "unplugin-auto-import": "^0.15.3",
  "unplugin-vue-components": "^0.24.1",
  vite: "5.4.14",
  "vite-plugin-compression": "^0.5.1",
  "vite-plugin-svg-icons": "^2.0.1",
  "vite-plugin-vue-devtools": "^7.7.2",
  "vue-eslint-parser": "^9.1.1",
  "vue-tsc": "^1.2.0"
};

// build/utils.ts
import dayjs from "file:///E:/flyme/node_modules/.pnpm/dayjs@1.11.13/node_modules/dayjs/dayjs.min.js";
var __vite_injected_original_dirname = "E:\\flyme\\build";
var root = process.cwd();
var __APP_INFO__ = {
  pkg: { name, version, dependencies, devDependencies },
  lastBuildTime: dayjs().format("YYYY-MM-DD HH:mm:ss")
};
var pathResolve = (dir) => resolve(__vite_injected_original_dirname, dir);
var alias = {
  "@": pathResolve("../src")
};
var extensions = [".js", ".ts", ".jsx", ".tsx", ".json", ".d.ts"];
var warpperEnv = (envConf) => {
  const ret = {
    VITE_PORT: 8848,
    VITE_PUBLIC_PATH: "/",
    VITE_CDN: false
  };
  for (const envName of Object.keys(envConf)) {
    let realName = envConf[envName].replace(/\\n/g, "\n");
    realName = realName === "true" ? true : realName === "false" ? false : realName;
    if (envName === "VITE_PORT") realName = Number(realName);
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
import vue from "file:///E:/flyme/node_modules/.pnpm/@vitejs+plugin-vue@4.6.2_vite@5.4.14_vue@3.5.10/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import { resolve as resolve2 } from "path";
import { createSvgIconsPlugin } from "file:///E:/flyme/node_modules/.pnpm/vite-plugin-svg-icons@2.0.1_vite@5.4.14/node_modules/vite-plugin-svg-icons/dist/index.mjs";
import AutoImport from "file:///E:/flyme/node_modules/.pnpm/unplugin-auto-import@0.15.3_@vueuse+core@10.11.1/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///E:/flyme/node_modules/.pnpm/unplugin-vue-components@0.24.1_vue@3.5.10/node_modules/unplugin-vue-components/dist/vite.mjs";
import { ElementPlusResolver } from "file:///E:/flyme/node_modules/.pnpm/unplugin-vue-components@0.24.1_vue@3.5.10/node_modules/unplugin-vue-components/dist/resolvers.mjs";
import { visualizer } from "file:///E:/flyme/node_modules/.pnpm/rollup-plugin-visualizer@5.14.0/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
import viteCompression from "file:///E:/flyme/node_modules/.pnpm/vite-plugin-compression@0.5.1_vite@5.4.14/node_modules/vite-plugin-compression/dist/index.mjs";
import tailwindcss from "file:///E:/flyme/node_modules/.pnpm/@tailwindcss+vite@4.0.17_vite@5.4.14/node_modules/@tailwindcss/vite/dist/index.mjs";
import VitePluginVueDevtools from "file:///E:/flyme/node_modules/.pnpm/vite-plugin-vue-devtools@7.7.2_vite@5.4.14_vue@3.5.10/node_modules/vite-plugin-vue-devtools/dist/vite.mjs";
var __vite_injected_original_dirname2 = "E:\\flyme\\build";
var getPluginsList = () => {
  return [
    vue(),
    // svg 配置，用于全局使用svg 组件
    createSvgIconsPlugin({
      iconDirs: [resolve2(__vite_injected_original_dirname2, "../src/assets/icons")],
      symbolId: "icon-[dir]-[name]"
    }),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    // 组件按需导入，elp-plus 及 src/components/*.vue
    Components({
      resolvers: [ElementPlusResolver()]
    }),
    // 打包分析
    visualizer({
      open: true,
      filename: "visualizer.html"
    }),
    viteCompression({
      verbose: true,
      // 默认即可
      disable: false,
      // 开启压缩(不禁用)，默认即可
      deleteOriginFile: false,
      // 删除源文件
      threshold: 5120,
      // 压缩前最小文件大小
      algorithm: "brotliCompress",
      // 压缩算法
      ext: ".br"
      // 文件类型
    }),
    tailwindcss(),
    process.env.NODE_ENV === "development" && VitePluginVueDevtools()
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
    optimizeDeps: {
      exclude: ["@tailwindcss/vite"]
    },
    plugins: getPluginsList(),
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern-compiler"
          // or 'modern'
        }
      }
    },
    build: {
      // https://cn.vitejs.dev/guide/build.html#browser-compatibility
      // target: "es2015",
      minify: "esbuild",
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAiYnVpbGQvdXRpbHMudHMiLCAicGFja2FnZS5qc29uIiwgImJ1aWxkL3BsdWdpbnMudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxmbHltZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRTpcXFxcZmx5bWVcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0U6L2ZseW1lL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgQ29uZmlnRW52LCBVc2VyQ29uZmlnRXhwb3J0LCBsb2FkRW52IH0gZnJvbSAndml0ZSc7XHJcbmltcG9ydCB7IF9fQVBQX0lORk9fXywgYWxpYXMsIGV4dGVuc2lvbnMsIHJvb3QsIHdhcnBwZXJFbnYgfSBmcm9tICcuL2J1aWxkL3V0aWxzJztcclxuaW1wb3J0IHsgZ2V0UGx1Z2luc0xpc3QgfSBmcm9tICcuL2J1aWxkL3BsdWdpbnMnO1xyXG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAncGF0aCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCAoeyBtb2RlIH06IENvbmZpZ0Vudik6IFVzZXJDb25maWdFeHBvcnQgPT4ge1xyXG4gIC8vIFx1NzNBRlx1NTg4M1x1NTNEOFx1OTFDRlxyXG4gIGNvbnN0IHsgVklURV9QT1JULCBWSVRFX1BVQkxJQ19QQVRIIH0gPSB3YXJwcGVyRW52KGxvYWRFbnYobW9kZSwgcm9vdCkpO1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgYmFzZTogVklURV9QVUJMSUNfUEFUSCxcclxuICAgIHJvb3QsXHJcbiAgICByZXNvbHZlOiB7XHJcbiAgICAgIGFsaWFzLCAvLyBcdThCQkVcdTdGNkVcdTdDRkJcdTdFREZcdThERUZcdTVGODRcdTUyMkJcdTU0MERcclxuICAgICAgZXh0ZW5zaW9ucyxcclxuICAgIH0sXHJcbiAgICBzZXJ2ZXI6IHtcclxuICAgICAgcG9ydDogVklURV9QT1JULFxyXG4gICAgICBob3N0OiAnMC4wLjAuMCcsXHJcbiAgICAgIHByb3h5OiB7XHJcbiAgICAgICAgJy90cSc6IHtcclxuICAgICAgICAgIHRhcmdldDogJ2h0dHBzOi8vd3d3LnRpYW5xaWFwaS5jb20vYXBpJyxcclxuICAgICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC90cS8sICcnKSxcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgICAvLyBcdTk4ODRcdTcwRURcdTY1ODdcdTRFRjZcdTRFRTVcdTYzRDBcdTUyNERcdThGNkNcdTYzNjJcdTU0OENcdTdGMTNcdTVCNThcdTdFRDNcdTY3OUNcdUZGMENcdTk2NERcdTRGNEVcdTU0MkZcdTUyQThcdTY3MUZcdTk1RjRcdTc2ODRcdTUyMURcdTU5Q0JcdTk4NzVcdTk3NjJcdTUyQTBcdThGN0RcdTY1RjZcdTk1N0ZcdTVFNzZcdTk2MzJcdTZCNjJcdThGNkNcdTYzNjJcdTcwMTFcdTVFMDNcclxuICAgICAgd2FybXVwOiB7XHJcbiAgICAgICAgY2xpZW50RmlsZXM6IFsnLi9pbmRleC5odG1sJywgJy4vc3JjL3t2aWV3cyxjb21wb25lbnRzfS8qJ10sXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgb3B0aW1pemVEZXBzOiB7XHJcbiAgICAgIGV4Y2x1ZGU6IFsnQHRhaWx3aW5kY3NzL3ZpdGUnXSxcclxuICAgIH0sXHJcbiAgICBwbHVnaW5zOiBnZXRQbHVnaW5zTGlzdCgpLFxyXG4gICAgY3NzOiB7XHJcbiAgICAgIHByZXByb2Nlc3Nvck9wdGlvbnM6IHtcclxuICAgICAgICBzY3NzOiB7XHJcbiAgICAgICAgICBhcGk6ICdtb2Rlcm4tY29tcGlsZXInLCAvLyBvciAnbW9kZXJuJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgYnVpbGQ6IHtcclxuICAgICAgLy8gaHR0cHM6Ly9jbi52aXRlanMuZGV2L2d1aWRlL2J1aWxkLmh0bWwjYnJvd3Nlci1jb21wYXRpYmlsaXR5XHJcbiAgICAgIC8vIHRhcmdldDogXCJlczIwMTVcIixcclxuICAgICAgbWluaWZ5OiAnZXNidWlsZCcsXHJcbiAgICAgIHNvdXJjZW1hcDogZmFsc2UsXHJcbiAgICAgIC8vIFx1NkQ4OFx1OTY2NFx1NjI1M1x1NTMwNVx1NTkyN1x1NUMwRlx1OEQ4NVx1OEZDNzUwMGtiXHU4QjY2XHU1NDRBXHJcbiAgICAgIGNodW5rU2l6ZVdhcm5pbmdMaW1pdDogNDAwMCxcclxuICAgICAgcm9sbHVwT3B0aW9uczoge1xyXG4gICAgICAgIGlucHV0OiB7XHJcbiAgICAgICAgICBtYWluOiByZXNvbHZlKF9fZGlybmFtZSwgJ2luZGV4Lmh0bWwnKSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8vIFx1OTc1OVx1NjAwMVx1OEQ0NFx1NkU5MFx1NTIwNlx1N0M3Qlx1NjI1M1x1NTMwNVxyXG4gICAgICAgIG91dHB1dDoge1xyXG4gICAgICAgICAgY2h1bmtGaWxlTmFtZXM6ICdzdGF0aWMvanMvW25hbWVdLVtoYXNoXS5qcycsXHJcbiAgICAgICAgICBlbnRyeUZpbGVOYW1lczogJ3N0YXRpYy9qcy9bbmFtZV0tW2hhc2hdLmpzJyxcclxuICAgICAgICAgIGFzc2V0RmlsZU5hbWVzOiAnc3RhdGljL1tleHRdL1tuYW1lXS1baGFzaF0uW2V4dF0nLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgZGVmaW5lOiB7XHJcbiAgICAgIF9fSU5UTElGWV9QUk9EX0RFVlRPT0xTX186IGZhbHNlLFxyXG4gICAgICBfX0FQUF9JTkZPX186IEpTT04uc3RyaW5naWZ5KF9fQVBQX0lORk9fXyksXHJcbiAgICB9LFxyXG4gIH07XHJcbn07XHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRTpcXFxcZmx5bWVcXFxcYnVpbGRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkU6XFxcXGZseW1lXFxcXGJ1aWxkXFxcXHV0aWxzLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9FOi9mbHltZS9idWlsZC91dGlscy50c1wiO2ltcG9ydCB7IHJlc29sdmUgfSBmcm9tICdwYXRoJztcclxuaW1wb3J0IHsgbmFtZSwgdmVyc2lvbiwgZGVwZW5kZW5jaWVzLCBkZXZEZXBlbmRlbmNpZXMgfSBmcm9tICcuLi9wYWNrYWdlLmpzb24nO1xyXG5pbXBvcnQgZGF5anMgZnJvbSAnZGF5anMnO1xyXG5cclxuLyoqIFx1NTQyRlx1NTJBOGBub2RlYFx1OEZEQlx1N0EwQlx1NjVGNlx1NjI0MFx1NTcyOFx1NURFNVx1NEY1Q1x1NzZFRVx1NUY1NVx1NzY4NFx1N0VERFx1NUJGOVx1OERFRlx1NUY4NCAqL1xyXG5jb25zdCByb290OiBzdHJpbmcgPSBwcm9jZXNzLmN3ZCgpO1xyXG5cclxuLyoqIFx1NUU3M1x1NTNGMFx1NzY4NFx1NTQwRFx1NzlGMFx1MzAwMVx1NzI0OFx1NjcyQ1x1MzAwMVx1OEZEMFx1ODg0Q1x1NjI0MFx1OTcwMFx1NzY4NGBub2RlYFx1NTQ4Q2BwbnBtYFx1NzI0OFx1NjcyQ1x1MzAwMVx1NEY5RFx1OEQ1Nlx1MzAwMVx1NjcwMFx1NTQwRVx1Njc4NFx1NUVGQVx1NjVGNlx1OTVGNFx1NzY4NFx1N0M3Qlx1NTc4Qlx1NjNEMFx1NzkzQSAqL1xyXG5jb25zdCBfX0FQUF9JTkZPX18gPSB7XHJcbiAgcGtnOiB7IG5hbWUsIHZlcnNpb24sIGRlcGVuZGVuY2llcywgZGV2RGVwZW5kZW5jaWVzIH0sXHJcbiAgbGFzdEJ1aWxkVGltZTogZGF5anMoKS5mb3JtYXQoJ1lZWVktTU0tREQgSEg6bW06c3MnKSxcclxufTtcclxuXHJcbi8qKiBcdThCQkVcdTdGNkVcdTUyMkJcdTU0MEQgKi9cclxuY29uc3QgcGF0aFJlc29sdmUgPSAoZGlyOiBzdHJpbmcpOiBzdHJpbmcgPT4gcmVzb2x2ZShfX2Rpcm5hbWUsIGRpcik7XHJcbmNvbnN0IGFsaWFzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xyXG4gICdAJzogcGF0aFJlc29sdmUoJy4uL3NyYycpLFxyXG59O1xyXG5cclxuLyoqIFx1NUJGQ1x1NTE2NVx1NjU4N1x1NEVGNlx1NjVGNlx1NjBGM1x1ODk4MVx1NzcwMVx1NzU2NVx1NzY4NFx1NjI2OVx1NUM1NVx1NTQwRFx1NTIxN1x1ODg2OCAqL1xyXG5jb25zdCBleHRlbnNpb25zOiBBcnJheTxzdHJpbmc+ID0gWycuanMnLCAnLnRzJywgJy5qc3gnLCAnLnRzeCcsICcuanNvbicsJy5kLnRzJ107XHJcblxyXG4vKiogXHU1OTA0XHU3NDA2XHU3M0FGXHU1ODgzXHU1M0Q4XHU5MUNGICovXHJcbmNvbnN0IHdhcnBwZXJFbnYgPSAoZW52Q29uZjogUmVjb3JkYWJsZSk6IFZpdGVFbnYgPT4ge1xyXG4gIGNvbnN0IHJldDogVml0ZUVudiA9IHtcclxuICAgIFZJVEVfUE9SVDogODg0OCxcclxuICAgIFZJVEVfUFVCTElDX1BBVEg6ICcvJyxcclxuICAgIFZJVEVfQ0ROOiBmYWxzZSxcclxuICB9O1xyXG5cclxuICBmb3IgKGNvbnN0IGVudk5hbWUgb2YgT2JqZWN0LmtleXMoZW52Q29uZikpIHtcclxuICAgIGxldCByZWFsTmFtZSA9IGVudkNvbmZbZW52TmFtZV0ucmVwbGFjZSgvXFxcXG4vZywgJ1xcbicpO1xyXG4gICAgcmVhbE5hbWUgPSByZWFsTmFtZSA9PT0gJ3RydWUnID8gdHJ1ZSA6IHJlYWxOYW1lID09PSAnZmFsc2UnID8gZmFsc2UgOiByZWFsTmFtZTtcclxuICAgIGlmIChlbnZOYW1lID09PSAnVklURV9QT1JUJykgcmVhbE5hbWUgPSBOdW1iZXIocmVhbE5hbWUpO1xyXG4gICAgcmV0W2Vudk5hbWVdID0gcmVhbE5hbWU7XHJcbiAgICBpZiAodHlwZW9mIHJlYWxOYW1lID09PSAnc3RyaW5nJykge1xyXG4gICAgICBwcm9jZXNzLmVudltlbnZOYW1lXSA9IHJlYWxOYW1lO1xyXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgcmVhbE5hbWUgPT09ICdvYmplY3QnKSB7XHJcbiAgICAgIHByb2Nlc3MuZW52W2Vudk5hbWVdID0gSlNPTi5zdHJpbmdpZnkocmVhbE5hbWUpO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gcmV0O1xyXG59O1xyXG5cclxuZXhwb3J0IHsgcm9vdCwgYWxpYXMsIGV4dGVuc2lvbnMsIHdhcnBwZXJFbnYsIHBhdGhSZXNvbHZlLCBfX0FQUF9JTkZPX18gfTtcclxuIiwgIntcbiAgXCJuYW1lXCI6IFwiYWdlcmFyc1wiLFxuICBcInByaXZhdGVcIjogdHJ1ZSxcbiAgXCJ0eXBlXCI6IFwibW9kdWxlXCIsXG4gIFwidmVyc2lvblwiOiBcIjEuMS4wXCIsXG4gIFwic2NyaXB0c1wiOiB7XG4gICAgXCJkZXZcIjogXCJ2aXRlIC0tb3BlblwiLFxuICAgIFwic2VydmVcIjogXCJwbnBtIGRldlwiLFxuICAgIFwiYnVpbGRcIjogXCJ2aXRlIGJ1aWxkXCIsXG4gICAgXCJwcmVpbnN0YWxsXCI6IFwibnB4IG9ubHktYWxsb3cgcG5wbVwiXG4gIH0sXG4gIFwiY29uZmlnXCI6IHtcbiAgICBcImNvbW1pdGl6ZW5cIjoge1xuICAgICAgXCJwYXRoXCI6IFwiLi9ub2RlX21vZHVsZXMvY3otY3VzdG9taXphYmxlXCJcbiAgICB9XG4gIH0sXG4gIFwiZGVwZW5kZW5jaWVzXCI6IHtcbiAgICBcIkBhbWFwL2FtYXAtanNhcGktbG9hZGVyXCI6IFwiXjEuMC4xXCIsXG4gICAgXCJAYW50di9nNlwiOiBcIl40LjguMTdcIixcbiAgICBcIkBiYXJiYS9jb3JlXCI6IFwiXjIuMTAuM1wiLFxuICAgIFwiQGVsZW1lbnQtcGx1cy9pY29ucy12dWVcIjogXCJeMi4xLjBcIixcbiAgICBcIkB0YWlsd2luZGNzcy92aXRlXCI6IFwiXjQuMC4xN1wiLFxuICAgIFwiQHZ1ZS1mbG93L2JhY2tncm91bmRcIjogXCJeMS4zLjBcIixcbiAgICBcIkB2dWUtZmxvdy9jb250cm9sc1wiOiBcIl4xLjEuMVwiLFxuICAgIFwiQHZ1ZS1mbG93L2NvcmVcIjogXCJeMS4zMy41XCIsXG4gICAgXCJAdnVlLWZsb3cvbWluaW1hcFwiOiBcIl4xLjQuMFwiLFxuICAgIFwiQHZ1ZXVzZS9jb3JlXCI6IFwiXjEwLjExLjBcIixcbiAgICBcImF4aW9zXCI6IFwiXjEuNC4wXCIsXG4gICAgXCJjYW52YXMtY29uZmV0dGlcIjogXCJeMS45LjNcIixcbiAgICBcImRheWpzXCI6IFwiXjEuMTEuMTNcIixcbiAgICBcImVjaGFydHNcIjogXCJeNS40LjNcIixcbiAgICBcImVjaGFydHMtZ2xcIjogXCJeMi4wLjlcIixcbiAgICBcImVsZW1lbnQtcGx1c1wiOiBcIl4yLjMuM1wiLFxuICAgIFwiZXMtdG9vbGtpdFwiOiBcIl4xLjEzLjFcIixcbiAgICBcImV4Y2VsanNcIjogXCJeNC4zLjBcIixcbiAgICBcImZha2UtcHJvZ3Jlc3NcIjogXCJeMS4wLjRcIixcbiAgICBcImdjb29yZFwiOiBcIl4wLjMuMlwiLFxuICAgIFwiZ3NhcFwiOiBcIl4zLjEyLjVcIixcbiAgICBcImludHJvLmpzXCI6IFwiXjcuMC4xXCIsXG4gICAgXCJsYWJlbC1zdHVkaW9cIjogXCJeMS4wLjFcIixcbiAgICBcImxlYWZsZXRcIjogXCJeMS45LjRcIixcbiAgICBcImxlYWZsZXQtYW50LXBhdGhcIjogXCJeMS4zLjBcIixcbiAgICBcImxlYWZsZXQtYm91bmRhcnktY2FudmFzXCI6IFwiXjEuMC4wXCIsXG4gICAgXCJsZWFmbGV0LWNvbnRyb2wtbWluaS1tYXBcIjogXCJeMC40LjBcIixcbiAgICBcImxlYWZsZXQtZHJhd1wiOiBcIl4xLjAuNFwiLFxuICAgIFwibGVhZmxldC1lYXN5cHJpbnRcIjogXCJeMi4xLjlcIixcbiAgICBcImxlYWZsZXQtbWVhc3VyZVwiOiBcIl4zLjEuMFwiLFxuICAgIFwibGVhZmxldC1tb3ZpbmctbWFya2VyXCI6IFwiXjAuMy4wXCIsXG4gICAgXCJsZWFmbGV0LXBvbHlsaW5lZGVjb3JhdG9yXCI6IFwiXjEuNi4wXCIsXG4gICAgXCJsZWFmbGV0LXB1bHNlLWljb25cIjogXCJeMC4xLjBcIixcbiAgICBcImxlYWZsZXQuZnVsbHNjcmVlblwiOiBcIl4zLjAuMVwiLFxuICAgIFwibGVhZmxldC5tb3Rpb25cIjogXCJeMC4zLjJcIixcbiAgICBcImxvdHRpZS13ZWJcIjogXCJeNS4xMS4wXCIsXG4gICAgXCJtaXR0XCI6IFwiXjMuMC4wXCIsXG4gICAgXCJuYW5vaWRcIjogXCJeNS4wLjdcIixcbiAgICBcIm5wcm9ncmVzc1wiOiBcIl4wLjIuMFwiLFxuICAgIFwicC1saW1pdFwiOiBcIl42LjEuMFwiLFxuICAgIFwicGRmanMtZGlzdFwiOiBcIl4zLjcuMTA3XCIsXG4gICAgXCJwaW5pYVwiOiBcIl4yLjEuNFwiLFxuICAgIFwicGluaWEtcGx1Z2luLXBlcnNpc3RcIjogXCJeMS4wLjBcIixcbiAgICBcInBvcGxhci1hbm5vdGF0aW9uXCI6IFwiXjIuMC4zXCIsXG4gICAgXCJzb3J0YWJsZWpzXCI6IFwiXjEuMTUuNlwiLFxuICAgIFwidGFpbHdpbmRjc3NcIjogXCJeNC4wLjE3XCIsXG4gICAgXCJ0aHJlZVwiOiBcIl4wLjE2OS4wXCIsXG4gICAgXCJ2dWVcIjogXCIzLjUuMTBcIixcbiAgICBcInZ1ZS1jbGlwYm9hcmQzXCI6IFwiXjIuMC4wXCIsXG4gICAgXCJ2dWUtZWNoYXJ0c1wiOiBcIl42LjcuM1wiLFxuICAgIFwidnVlLXBkZi1lbWJlZFwiOiBcIl4yLjAuNFwiLFxuICAgIFwidnVlLXJvdXRlclwiOiBcIl40LjIuNVwiLFxuICAgIFwidnVlLXVwbG9hZC1jb21wb25lbnRcIjogXCJeMy4xLjhcIixcbiAgICBcInZ1ZS12aXJ0dWFsLXNjcm9sbGVyXCI6IFwiMi4wLjAtYmV0YS44XCJcbiAgfSxcbiAgXCJkZXZEZXBlbmRlbmNpZXNcIjoge1xuICAgIFwiQGVzbGludC9jcmVhdGUtY29uZmlnXCI6IFwiXjAuNC4zXCIsXG4gICAgXCJAdHlwZXMvbGVhZmxldFwiOiBcIl4xLjkuMTRcIixcbiAgICBcIkB0eXBlc2NyaXB0LWVzbGludC9lc2xpbnQtcGx1Z2luXCI6IFwiXjUuNTkuMFwiLFxuICAgIFwiQHZpdGVqcy9wbHVnaW4tdnVlXCI6IFwiXjQuMS4wXCIsXG4gICAgXCJAdnVldXNlL21vdGlvblwiOiBcIl4yLjEuMFwiLFxuICAgIFwiYWNlLWJ1aWxkc1wiOiBcIl4xLjE5LjBcIixcbiAgICBcImF1dG9wcmVmaXhlclwiOiBcIl4xMC40LjE0XCIsXG4gICAgXCJjb21taXRpemVuXCI6IFwiXjQuMy4wXCIsXG4gICAgXCJjei1jdXN0b21pemFibGVcIjogXCJeNy4yLjFcIixcbiAgICBcImVzbGludFwiOiBcIl44LjM5LjBcIixcbiAgICBcImVzbGludC1jb25maWctcHJldHRpZXJcIjogXCJeOC44LjBcIixcbiAgICBcImVzbGludC1jb25maWctc3RhbmRhcmQtd2l0aC10eXBlc2NyaXB0XCI6IFwiXjM0LjAuMVwiLFxuICAgIFwiZXNsaW50LXBsdWdpbi1pbXBvcnRcIjogXCJeMi4yNy41XCIsXG4gICAgXCJlc2xpbnQtcGx1Z2luLW5cIjogXCJeMTUuNy4wXCIsXG4gICAgXCJlc2xpbnQtcGx1Z2luLXByZXR0aWVyXCI6IFwiXjQuMi4xXCIsXG4gICAgXCJlc2xpbnQtcGx1Z2luLXByb21pc2VcIjogXCJeNi4xLjFcIixcbiAgICBcImVzbGludC1wbHVnaW4tdnVlXCI6IFwiXjkuMTEuMFwiLFxuICAgIFwicHJldHRpZXJcIjogXCJeMy41LjNcIixcbiAgICBcInByZXR0aWVyLXBsdWdpbi10YWlsd2luZGNzc1wiOiBcIl4wLjYuMTFcIixcbiAgICBcInJvbGx1cC1wbHVnaW4tdmlzdWFsaXplclwiOiBcIl41LjEyLjBcIixcbiAgICBcInNhc3NcIjogXCJeMS40Mi4xXCIsXG4gICAgXCJzYXNzLWxvYWRlclwiOiBcIl4xMi4xLjBcIixcbiAgICBcInRlcnNlclwiOiBcIl41LjE5LjJcIixcbiAgICBcInR5cGVzY3JpcHRcIjogXCJeNS4wLjJcIixcbiAgICBcInVucGx1Z2luLWF1dG8taW1wb3J0XCI6IFwiXjAuMTUuM1wiLFxuICAgIFwidW5wbHVnaW4tdnVlLWNvbXBvbmVudHNcIjogXCJeMC4yNC4xXCIsXG4gICAgXCJ2aXRlXCI6IFwiNS40LjE0XCIsXG4gICAgXCJ2aXRlLXBsdWdpbi1jb21wcmVzc2lvblwiOiBcIl4wLjUuMVwiLFxuICAgIFwidml0ZS1wbHVnaW4tc3ZnLWljb25zXCI6IFwiXjIuMC4xXCIsXG4gICAgXCJ2aXRlLXBsdWdpbi12dWUtZGV2dG9vbHNcIjogXCJeNy43LjJcIixcbiAgICBcInZ1ZS1lc2xpbnQtcGFyc2VyXCI6IFwiXjkuMS4xXCIsXG4gICAgXCJ2dWUtdHNjXCI6IFwiXjEuMi4wXCJcbiAgfSxcbiAgXCJwYWNrYWdlTWFuYWdlclwiOiBcInBucG1AOC4xNC4xXCIsXG4gIFwiZW5naW5lc1wiOiB7XG4gICAgXCJub2RlXCI6IFwiPj0xOFwiLFxuICAgIFwicG5wbVwiOiBcIj49OC4xNC4wXCJcbiAgfVxufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxmbHltZVxcXFxidWlsZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRTpcXFxcZmx5bWVcXFxcYnVpbGRcXFxccGx1Z2lucy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRTovZmx5bWUvYnVpbGQvcGx1Z2lucy50c1wiO2ltcG9ydCB7IFBsdWdpbk9wdGlvbiB9IGZyb20gJ3ZpdGUnO1xyXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSc7XHJcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tICdwYXRoJztcclxuaW1wb3J0IHsgY3JlYXRlU3ZnSWNvbnNQbHVnaW4gfSBmcm9tICd2aXRlLXBsdWdpbi1zdmctaWNvbnMnO1xyXG5pbXBvcnQgQXV0b0ltcG9ydCBmcm9tICd1bnBsdWdpbi1hdXRvLWltcG9ydC92aXRlJztcclxuaW1wb3J0IENvbXBvbmVudHMgZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvdml0ZSc7XHJcbmltcG9ydCB7IEVsZW1lbnRQbHVzUmVzb2x2ZXIgfSBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy9yZXNvbHZlcnMnO1xyXG5pbXBvcnQgeyB2aXN1YWxpemVyIH0gZnJvbSAncm9sbHVwLXBsdWdpbi12aXN1YWxpemVyJztcclxuaW1wb3J0IHZpdGVDb21wcmVzc2lvbiBmcm9tICd2aXRlLXBsdWdpbi1jb21wcmVzc2lvbic7XHJcbmltcG9ydCB0YWlsd2luZGNzcyBmcm9tICdAdGFpbHdpbmRjc3Mvdml0ZSc7XHJcbmltcG9ydCBWaXRlUGx1Z2luVnVlRGV2dG9vbHMgZnJvbSAndml0ZS1wbHVnaW4tdnVlLWRldnRvb2xzJztcclxuXHJcbi8qKiBcdTgzQjdcdTUzRDZcdTYzRDJcdTRFRjZcdTUyMTdcdTg4NjggKi9cclxuZXhwb3J0IGNvbnN0IGdldFBsdWdpbnNMaXN0ID0gKCk6IEFycmF5PFBsdWdpbk9wdGlvbj4gPT4ge1xyXG4gIHJldHVybiBbXHJcbiAgICB2dWUoKSxcclxuICAgIC8vIHN2ZyBcdTkxNERcdTdGNkVcdUZGMENcdTc1MjhcdTRFOEVcdTUxNjhcdTVDNDBcdTRGN0ZcdTc1MjhzdmcgXHU3RUM0XHU0RUY2XHJcbiAgICBjcmVhdGVTdmdJY29uc1BsdWdpbih7XHJcbiAgICAgIGljb25EaXJzOiBbcmVzb2x2ZShfX2Rpcm5hbWUsICcuLi9zcmMvYXNzZXRzL2ljb25zJyldLFxyXG4gICAgICBzeW1ib2xJZDogJ2ljb24tW2Rpcl0tW25hbWVdJyxcclxuICAgIH0pLFxyXG4gICAgQXV0b0ltcG9ydCh7XHJcbiAgICAgIHJlc29sdmVyczogW0VsZW1lbnRQbHVzUmVzb2x2ZXIoKV0sXHJcbiAgICB9KSxcclxuICAgIC8vIFx1N0VDNFx1NEVGNlx1NjMwOVx1OTcwMFx1NUJGQ1x1NTE2NVx1RkYwQ2VscC1wbHVzIFx1NTNDQSBzcmMvY29tcG9uZW50cy8qLnZ1ZVxyXG4gICAgQ29tcG9uZW50cyh7XHJcbiAgICAgIHJlc29sdmVyczogW0VsZW1lbnRQbHVzUmVzb2x2ZXIoKV0sXHJcbiAgICB9KSxcclxuICAgIC8vIFx1NjI1M1x1NTMwNVx1NTIwNlx1Njc5MFxyXG4gICAgdmlzdWFsaXplcih7XHJcbiAgICAgIG9wZW46IHRydWUsXHJcbiAgICAgIGZpbGVuYW1lOiAndmlzdWFsaXplci5odG1sJyxcclxuICAgIH0pLFxyXG4gICAgdml0ZUNvbXByZXNzaW9uKHtcclxuICAgICAgdmVyYm9zZTogdHJ1ZSwgLy8gXHU5RUQ4XHU4QkE0XHU1MzczXHU1M0VGXHJcbiAgICAgIGRpc2FibGU6IGZhbHNlLCAvLyBcdTVGMDBcdTU0MkZcdTUzOEJcdTdGMjkoXHU0RTBEXHU3OTgxXHU3NTI4KVx1RkYwQ1x1OUVEOFx1OEJBNFx1NTM3M1x1NTNFRlxyXG4gICAgICBkZWxldGVPcmlnaW5GaWxlOiBmYWxzZSwgLy8gXHU1MjIwXHU5NjY0XHU2RTkwXHU2NTg3XHU0RUY2XHJcbiAgICAgIHRocmVzaG9sZDogNTEyMCwgLy8gXHU1MzhCXHU3RjI5XHU1MjREXHU2NzAwXHU1QzBGXHU2NTg3XHU0RUY2XHU1OTI3XHU1QzBGXHJcbiAgICAgIGFsZ29yaXRobTogJ2Jyb3RsaUNvbXByZXNzJywgLy8gXHU1MzhCXHU3RjI5XHU3Qjk3XHU2Q0Q1XHJcbiAgICAgIGV4dDogJy5icicsIC8vIFx1NjU4N1x1NEVGNlx1N0M3Qlx1NTc4QlxyXG4gICAgfSksXHJcbiAgICB0YWlsd2luZGNzcygpLFxyXG4gICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCcgJiYgVml0ZVBsdWdpblZ1ZURldnRvb2xzKCksXHJcbiAgXTtcclxufTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE4TSxTQUFzQyxlQUFlOzs7QUNBN0MsU0FBUyxl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cUI7QUFBQSxRQUNuQixNQUFNO0FBQUEsVUFDSixLQUFLO0FBQUE7QUFBQSxRQUNQO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUNBLE9BQU87QUFBQTtBQUFBO0FBQUEsTUFHTCxRQUFRO0FBQUEsTUFDUixXQUFXO0FBQUE7QUFBQSxNQUVYLHVCQUF1QjtBQUFBLE1BQ3ZCLGVBQWU7QUFBQSxRQUNiLE9BQU87QUFBQSxVQUNMLE1BQU1DLFNBQVFDLG1DQUFXLFlBQVk7QUFBQSxRQUN2QztBQUFBO0FBQUEsUUFFQSxRQUFRO0FBQUEsVUFDTixnQkFBZ0I7QUFBQSxVQUNoQixnQkFBZ0I7QUFBQSxVQUNoQixnQkFBZ0I7QUFBQSxRQUNsQjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsSUFDQSxRQUFRO0FBQUEsTUFDTiwyQkFBMkI7QUFBQSxNQUMzQixjQUFjLEtBQUssVUFBVSxZQUFZO0FBQUEsSUFDM0M7QUFBQSxFQUNGO0FBQ0Y7IiwKICAibmFtZXMiOiBbInJlc29sdmUiLCAiX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUiLCAicmVzb2x2ZSIsICJfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSIsICJyZXNvbHZlIiwgIl9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lIiwgInJlc29sdmUiLCAiX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUiXQp9Cg==
