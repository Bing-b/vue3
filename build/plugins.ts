import { PluginOption } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { visualizer } from 'rollup-plugin-visualizer';
import viteCompression from 'vite-plugin-compression';

/** 获取插件列表 */
export const getPluginsList = (): Array<PluginOption> => {
  return [
    vue(),
    // svg 配置，用于全局使用svg 组件
    createSvgIconsPlugin({
      iconDirs: [resolve(__dirname, '../src/assets/icons')],
      symbolId: 'icon-[dir]-[name]',
    }),
    // 自动导入el-plus api
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    // 组件按需导入，elp-plus 及 src/components/*.vue
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    // 打包分析
    visualizer({
      open: true,
      filename: 'visualizer.html',
    }),
    viteCompression({
      verbose: true, // 默认即可
      disable: false, // 开启压缩(不禁用)，默认即可
      deleteOriginFile: false, // 删除源文件
      threshold: 5120, // 压缩前最小文件大小
      algorithm: 'brotliCompress', // 压缩算法
      ext: '.br', // 文件类型
    }),
  ];
};
