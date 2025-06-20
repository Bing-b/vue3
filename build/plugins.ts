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

// 图标按需加载
import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver';
import { FileSystemIconLoader } from 'unplugin-icons/loaders';
import path from 'node:path';

const localIconPath = path.join(process.cwd(), 'src/assets/icons');

import { generateLangStats } from '../src/utils/file-stats'; // 统计项目文件脚本

import { templateCompilerOptions } from '@tresjs/core';
import { getArgs } from './utils';

function fileStatsPlugin() {
  return {
    name: 'vite-plugin-file-stats-json',
    apply: 'serve',
    configureServer() {
      generateLangStats(); // 写入 JSON
    },
  };
}

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
    vue({ ...templateCompilerOptions }),
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
      resolvers: [
        ElementPlusResolver(),
        IconsResolver({
          prefix: 'icon',
          customCollections: ['local-icon'], // 如若 Icons 配置本地图标，这里也需要配置
        }),
      ],
    }),
    Icons({
      autoInstall: true, // 自动安装项目中用到的图标集合
      customCollections: {
        'local-icon': FileSystemIconLoader(localIconPath, (svg) =>
          svg.replace(/^<svg\s/, '<svg width="1em" height="1em" class="dida-icon"'),
        ),
      },
      // scale: 1.2, // 图标大小为 1.2em; 默认值是 1
      // defaultStyle:"", // 默认值 空字符串; 设置默认css样式的
      // defaultClass:"",// 默认值 空字符串; 设置默认 class 的
      // compiler:"vue3",// 设置图标的编译方式，有 vue3/vue2/jsx/null,默认值是null
    }),

    fileStatsPlugin(),

    // 处理旧浏览器兼容
    isProd &&
      isLegacy &&
      legacy({
        targets: ['defaults', 'not IE 11'],
        modernPolyfills: true,
      }),

    // 打包分析
    visualizer({
      open: false,
      gzipSize: true,
      brotliSize: true,
      template: 'treemap',
      filename: 'visualizer.html',
    }),
    viteCompression({
      deleteOriginFile: false, // 删除源文件
      threshold: 1024 * 20, // 压缩前最小文件大小
      algorithm: 'brotliCompress', // 压缩算法
      ext: '.br', // 文件类型
    }),
    !isProd && VitePluginVueDevtools(),
  ].filter(Boolean);
};
