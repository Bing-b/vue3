import { PluginOption } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { visualizer } from 'rollup-plugin-visualizer';
import viteCompression from 'vite-plugin-compression';
import { svgSpritemap } from 'vite-plugin-svg-spritemap';

/** 获取插件列表 */
export const getPluginsList = (): Array<PluginOption> => {
  return [
    vue(),
    // svg注册
    createSvgIconsPlugin({
      iconDirs: [resolve(__dirname, '../src/assets/icons')],
      symbolId: 'icon-[dir]-[name]',
    }),
    // el-plus 按需导入
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
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
      //ext: '.gz', // 文件类型
    }),
    svgSpritemap({
      pattern: 'src/assets/icons/**/*.svg', // 输入的 SVG 图标路径
    }),
  ];
};
