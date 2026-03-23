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
      include: ['element-plus/es/locale/lang/zh-cn', 'element-plus/es/locale/lang/en'],
      exclude: ['poplar-annotation'],
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
      minify: 'oxc',
      rolldownOptions: {
        output: {
          minify: {
            compress: {
              dropConsole: true,
              dropDebugger: true,
            },
          },
        },
      },
      reportCompressedSize: false, // 显示压缩后大小 禁用提示构建速度
      chunkSizeWarningLimit: 20480,
      commonjsOptions: {
        transformMixedEsModules: true, // 优化cjs加载方式
      },
      rollupOptions: {
        output: {
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/assets/[name]-[hash].[ext]',
          // 优化分包策略
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              if (id.includes('element-plus')) return 'ui-element';
              if (id.includes('echarts') || id.includes('amcharts')) return 'ui-charts';
              if (id.includes('three')) return 'ui-three';
              if (id.includes('leaflet')) return 'ui-map';
              if (id.includes('pdfjs-dist')) return 'ui-pdf';
              if (id.includes('vue') || id.includes('pinia') || id.includes('axios'))
                return 'ui-core';
              return 'vendor';
            }
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
