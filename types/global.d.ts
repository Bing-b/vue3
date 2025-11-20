/**
 * 全局类型声明，无需引入直接在 `.vue` 、`.ts` 、`.tsx` 文件使用即可获得类型提示
 */

declare global {
  /**
   * 平台的名称、版本、运行所需的`node`和`pnpm`版本、依赖、最后构建时间的类型提示
   */
  const __APP_INFO__: {
    pkg: {
      name: string;
      version: string;
      engines: {
        node: string;
        pnpm: string;
      };
      dependencies: Recordable<string>;
      devDependencies: Recordable<string>;
    };
    lastBuildTime: string;
  };
}
interface Window {
  api: {
    gis: string;
  };
}
interface ViteEnv {
  VITE_PORT: number; //  本地运行端口号
  VITE_PUBLIC_PATH: string; // 打包路径
  VITE_CDN: boolean; // 是否在打包时使用cdn替换本地库 替换 true 不替换 false
}

/** 全局自定义环境变量类型声明 */
declare module 'nprogress';
declare module 'three';
declare module 'sortablejs';
declare module 'lunar-javascript';
declare module 'file-stats';
declare module '@tresjs/core';
declare module 'matter-js';
declare module 'vue-virtual-scroller';
