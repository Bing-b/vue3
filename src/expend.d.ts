// 通过declare声明的类型或者变量或者模块，在include包含的文件范围内，都可以直接引用而不用去import或者import type相应的变量或者类型
declare module 'vue' {
  interface ComponentCustomProperties {
    $getImg: (key: string) => string
  }
}

export {};