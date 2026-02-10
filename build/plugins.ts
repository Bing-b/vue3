import { PluginOption } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { visualizer } from 'rollup-plugin-visualizer';
import viteCompression from 'vite-plugin-compression';
import VitePluginVueDevtools from 'vite-plugin-vue-devtools';
import legacy from 'vite-plugin-legacy-swc'; // 兼容处理

// import { generateLangStats } from '../src/utils/file-stats'; // 统计项目文件脚本

import { getArgs } from './utils';

// function fileStatsPlugin() {
//   return {
//     name: 'vite-plugin-file-stats-json',
//     apply: 'serve',
//     configureServer() {
//       generateLangStats(); // 写入 JSON
//     },
//   };
// }

const args = getArgs(); // 解析package:scripts 命令行参数
const isLegacy = args.legacy === true; // 是否兼容旧浏览器

/**
 * 创建 Vite 插件列表，根据当前运行模式（开发 or 构建）自动注入所需插件
 * @param command
 * @returns
 */
export const createVitePlugins = (command: 'build' | 'serve'): Array<PluginOption> => {
  const isProd = command === 'build';
  return [
    vue(),
    // svg 配置，用于全局使用svg 组件
    createSvgIconsPlugin({
      iconDirs: [resolve(__dirname, '../src/assets/icons')],
      symbolId: 'icon-[dir]-[name]',
    }),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    // 组件按需导入，elp-plus 及 src/components/*.vue
    Components({
      resolvers: [ElementPlusResolver()],
    }),

    // fileStatsPlugin(),

    // 处理旧浏览器兼容
    isProd &&
      isLegacy &&
      legacy({
        targets: ['defaults', 'not IE 11', 'chrome >= 60'],
        modernPolyfills: true,
      }),

    // 打包分析
    // visualizer({
    //   open: false,
    //   gzipSize: true,
    //   brotliSize: true,
    //   template: 'treemap',
    //   filename: 'visualizer.html',
    // }),
    viteCompression({
      deleteOriginFile: false, // 删除源文件
      threshold: 1024 * 20, // 压缩前最小文件大小
      // algorithm: 'brotliCompress', // 压缩算法
      // ext: '.br', // 文件类型
    }),
    !isProd && VitePluginVueDevtools(),
  ].filter(Boolean);
};
