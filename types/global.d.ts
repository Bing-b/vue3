/**
 * 全局类型声明，无需引入直接在 `.vue` 、`.ts` 、`.tsx` 文件使用即可获得类型提示
 */

declare global {
  interface Window {
    gis: {
      PROXY_URL: string;
    };
  }

  declare interface ViteEnv {
    VITE_PORT: number; //  本地运行端口号
    VITE_PUBLIC_PATH: string; // 打包路径
    VITE_CDN: boolean; // 是否在打包时使用cdn替换本地库 替换 true 不替换 false
  }
}

/** 全局自定义环境变量类型声明 */

declare module 'nprogress';
declare module 'three';
