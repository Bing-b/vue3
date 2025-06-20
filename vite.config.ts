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
      },
      // 预热文件以提前转换和缓存结果，降低启动期间的初始页面加载时长并防止转换瀑布
      warmup: {
        clientFiles: ['./index.html', './src/{views,components}/*'],
      },
    },
    optimizeDeps: {
      exclude: ['@vueuse/core'], // pip
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
      // https://cn.vitejs.dev/guide/build.html#browser-compatibility
      reportCompressedSize: false, // 显示压缩后大小 禁用提示构建速度
      chunkSizeWarningLimit: 20480,
      ...(command === 'build' && {
        esbuild: {
          drop: ['console', 'debugger'],
        },
      }),
      // terserOptions: {
      //   compress: {
      //     drop_console: true, // 移除所有的 console.* 调用
      //     drop_debugger: true, // 移除所有的 debugger 语句
      //   },
      // },

      commonjsOptions: {
        transformMixedEsModules: true, // 优化cjs加载方式
      },
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
        },
        output: {
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/assets/[name]-[hash].[ext]',
          // 分包 chunk 提升首屏加载 及 缓存利用率
          manualChunks: {
            core: ['vue', 'vue-router', 'pinia', 'axios'],
            ui: ['element-plus'],
          },
        },
      },
    },
    define: {
      __INTLIFY_PROD_DEVTOOLS__: false,
      __APP_INFO__: JSON.stringify(__APP_INFO__),
    },
  };
});
