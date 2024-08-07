import { ConfigEnv, UserConfigExport, loadEnv } from 'vite';
import { __APP_INFO__, alias, extensions, root, warpperEnv } from './build/utils';
import { getPluginsList } from './build/plugins';
import { resolve } from 'path';

export default ({ mode }: ConfigEnv): UserConfigExport => {
  // 环境变量
  const { VITE_PORT, VITE_PUBLIC_PATH } = warpperEnv(loadEnv(mode, root));

  return {
    base: VITE_PUBLIC_PATH,
    root,
    resolve: {
      alias, // 设置系统路径别名
      extensions,
    },
    // 服务端渲染
    server: {
      port: VITE_PORT,
      host: '0.0.0.0',
      proxy: {
        '/tq': {
          target: 'https://www.tianqiapi.com/api',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/tq/, ''),
        },
      },
      // 预热文件以提前转换和缓存结果，降低启动期间的初始页面加载时长并防止转换瀑布
      warmup: {
        clientFiles: ['./index.html', './src/{views,components}/*'],
      },
    },
    plugins: getPluginsList(),
    build: {
      // https://cn.vitejs.dev/guide/build.html#browser-compatibility
      // target: "es2015",
      sourcemap: false,
      // 消除打包大小超过500kb警告
      chunkSizeWarningLimit: 4000,
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
        },
        // 静态资源分类打包
        output: {
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
        },
      },
    },
    define: {
      __INTLIFY_PROD_DEVTOOLS__: false,
      __APP_INFO__: JSON.stringify(__APP_INFO__),
    },
  };
};
