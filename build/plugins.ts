import { PluginOption } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path"; 
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

/** 获取插件列表 */
export const getPluginsList = (): Array<PluginOption>  => {
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
  ]
}