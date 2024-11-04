import { RouteRecordRaw } from 'vue-router';

/**
 * 功能页面路由
 */
export const mainRoutes: Array<RouteRecordRaw> = [
  { path: '/', redirect: '/home' },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('@/views/dashboard/index.vue'),
        meta: {
          title: '首页',
          icon: 'menu-menu_home',
        },
      },
      {
        path: '/components',
        name: 'components',
        redirect: '/tree',
        meta: {
          title: '功能组件',
          icon: 'menu-menu_style',
        },
        children: [
          {
            path: '/tree',
            name: 'tree',
            component: () => import('@/views/tree/index.vue'),
            meta: {
              title: '仿vscode目录',
            },
          },
          {
            path: '/upload',
            name: 'upload',
            component: () => import('@/views/upload/index.vue'),
            meta: {
              title: '文件上传',
              icon: 'other',
            },
          },
          {
            path: '/ace',
            name: '代码编辑器',
            component: () => import('@/views/ace-editor/index.vue'),
            meta: {
              title: '代码编辑器',
            },
          },
          {
            path: '/pdfview',
            name: 'PDF预览',
            component: () => import('@/views/pdf-view/index.vue'),
            meta: {
              title: 'PDF预览',
            },
          },
          {
            path: '/annotation',
            name: '标注',
            component: () => import('@/views/text-annotation/index.vue'),
            meta: {
              title: '标注',
            },
          },
        ],
      },

      {
        path: '/garph',
        name: 'garph',
        redirect: '/G6',
        meta: {
          title: '可视化',
          icon: 'menu-menu_graph',
        },
        children: [
          {
            path: '/vueFlow',
            name: 'vueFlow',
            component: () => import('@/views/vue-flow/index.vue'),
            meta: {
              title: 'vue-flow',
            },
          },
          {
            path: '/G6',
            name: 'G6',
            component: () => import('@/views/graph/index.vue'),
            meta: {
              title: 'G6',
              icon: 'other',
            },
          },
          {
            path: '/echarts',
            name: 'echarts',
            component: () => import('@/views/echart/index.vue'),
            meta: {
              title: 'echarts',
              icon: 'other',
            },
          },
          {
            path: '/gis',
            name: 'gis',
            component: () => import('@/views/gis/index.vue'),
            meta: {
              title: '地图',
              icon: 'other',
            },
          },
        ],
      },
      {
        path: '/animation',
        name: 'animation',
        redirect: '/btn',
        meta: {
          title: '指令',
          icon: 'menu-menu_animation',
        },
        children: [
          {
            path: '/drag',
            name: '拖拽指令',
            component: () => import('@/views/directives/dragDrect/index.vue'),
            meta: {
              title: '拖拽指令',
            },
          },
          {
            path: '/copy',
            name: '复制指令',
            component: () => import('@/views/directives/copy/index.vue'),
            meta: {
              title: '复制指令',
            },
          },
          {
            path: '/copytable',
            name: '拖拽表格指令',
            component: () => import('@/views/directives/sort-table/index.vue'),
            meta: {
              title: '拖拽表格指令',
            },
          },
        ],
      },
      {
        path: '/other',
        name: 'other',
        redirect: '/ot',
        meta: {
          title: '其他',
          icon: 'menu-menu_other',
        },
        children: [
          {
            path: '/ot',
            name: 'ot',
            component: () => import('@/views/other/index.vue'),
            meta: {
              title: '砸碎',
            },
          },
          {
            path: '/lottieWeb',
            name: 'lottieWeb',
            component: () => import('@/views/lottie-web/index.vue'),
            meta: {
              title: 'Lottie 动画',
              icon: 'animate',
            },
          },
          {
            path: '/iframe',
            name: '内嵌',
            component: () => import('@/views/iframe/index.vue'),
            meta: {
              title: '内嵌',
              icon: 'inside',
            },
          },
        ],
      },
      {
        path: '/css',
        name: 'CSS',
        component: () => import('@/views/svg-animation/index.vue'),
        meta: {
          title: 'SVG',
          icon: 'SVG',
        },
      },
      {
        path: '/threejs',
        name: 'threejs',
        component: () => import('@/views/threejs/index.vue'),
        meta: {
          title: 'threejs',
          icon: 'menu-menu_threejs',
        },
      },
      {
        path: '/funny',
        name: 'funny',
        component: () => import('@/views/funny/index.vue'),
        meta: {
          title: 'funny',
          icon: 'menu-funny',
        },
      },
      {
        path: '/info',
        name: '关于项目',
        component: () => import('@/views/project-info/index.vue'),
        meta: {
          title: '关于项目',
          icon: 'menu-menu_pinfo',
        },
      },
    ],
  },
];

/**
 * 定义静态路由
 * @description 用于固定的静态页面
 * @returns 返回路由菜单数据
 */
export const staticRoutes: Array<RouteRecordRaw> = [
  // {
  //   path: '/login',
  //   name: 'login',
  //   //component: '',
  //   meta: {
  //     title: '登录'
  //   }
  // },
  {
    path: '/404',
    name: 'notFound',
    component: () => import('@/views/error/404.vue'),
    meta: {
      title: 'message.staticRoutes.notFound',
    },
  },
  /**
   * 定义404界面
   * @link 参考：https://next.router.vuejs.org/zh/guide/essentials/history-mode.html#netlify
   */
  {
    path: '/:pathMatch(.*)',
    redirect: '/404',
  },
];
