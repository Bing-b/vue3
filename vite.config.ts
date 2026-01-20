import { defineConfig, loadEnv } from 'vite';
import { __APP_INFO__, alias, extensions, root, warpperEnv } from './build/utils';
import { createVitePlugins } from './build/plugins';
import { resolve } from 'path';

export default defineConfig(({ mode, command }) => {
  const { VITE_PORT, VITE_PUBLIC_PATH } = warpperEnv(loadEnv(mode, root));

  return {
    base: VITE_PUBLIC_PATH,
    root,
    resolve: {
      alias, // 设置系统路径别名
      extensions,
    },
    server: {
      port: VITE_PORT,
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: 'https://restapi.amap.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
        '/github': {
          target: 'https://api.github.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/github/, ''),
        },
        '/td': {
          target: 'https://api.tianditu.gov.cn',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/td/, ''),
        },
      },
      // 预热文件以提前转换和缓存结果，降低启动期间的初始页面加载时长并防止转换瀑布
      warmup: {
        // clientFiles: ['./index.html', './src/{components}/*'],
      },
    },
    optimizeDeps: {
      exclude: ['@vueuse/core', 'poplar-annotation'],
    },
    plugins: createVitePlugins(command),
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler', // 消除sass api 警告
        },
      },
    },

    build: {
      target: 'esnext',
      minify: 'esbuild',
      esbuild: {
        drop: ['console', 'debugger'], // 生产环境自动清理，不再需要单独配 ESLint 规则
      },
      reportCompressedSize: false, // 显示压缩后大小 禁用提示构建速度
      chunkSizeWarningLimit: 20480,
      commonjsOptions: {
        transformMixedEsModules: true, // 优化cjs加载方式
      },
      // rollupOptions: {
      //   input: {
      //     main: resolve(__dirname, 'index.html'),
      //   },
      //   output: {
      //     chunkFileNames: 'static/js/[name]-[hash].js',
      //     entryFileNames: 'static/js/[name]-[hash].js',
      //     assetFileNames: 'static/assets/[name]-[hash].[ext]',
      //     // 分包 chunk 提升首屏加载 及 缓存利用率
      //     manualChunks: {
      //       core: ['vue', 'vue-router', 'pinia', 'axios'],
      //       ui: ['element-plus'],
      //     },
      //   },
      // },
    },
    define: {
      __INTLIFY_PROD_DEVTOOLS__: false,
      __APP_INFO__: JSON.stringify(__APP_INFO__),
    },
  };
});
