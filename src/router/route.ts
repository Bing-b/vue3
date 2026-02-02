import { RouteRecordRaw } from 'vue-router';

/**
 * 功能页面路由
 */
export const mainRoutes: Array<RouteRecordRaw> = [
  { path: '/', redirect: '/home' },
  {
    path: '/home',
    name: 'index',
    component: () => import('@/layout/index.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: {
          title: '首页',
          icon: 'menu-menu_home',
        },
      },
      {
        path: '/components',
        name: 'components',
        meta: {
          title: '功能组件',
          icon: 'menu-menu_style',
        },
        component: () => import('@/views/components/index.vue'),
      },

      {
        path: '/garph',
        name: 'garph',
        redirect: '/gis',
        meta: {
          title: '可视化',
          icon: 'menu-menu_graph',
        },
        children: [
          // {
          //   path: '/G6',
          //   name: 'G6',
          //   component: () => import('@/views/graph/index.vue'),
          //   meta: {
          //     title: 'G6',
          //     icon: 'other',
          //   },
          // },
          {
            path: '/gis',
            name: 'gis',
            component: () => import('@/views/gis/index.vue'),
            meta: {
              title: '地图',
              icon: 'other',
            },
          },
          {
            path: '/gistrack',
            name: 'gistrack',
            component: () => import('@/views/gis/track.vue'),
            meta: {
              title: '导航',
              icon: 'other',
            },
          },
          {
            path: '/echarts',
            name: 'echarts',
            component: () => import('@/views/echarts/index.vue'),
            meta: {
              title: 'echarts',
              icon: 'other',
            },
          },
        ],
      },
      {
        path: '/directives',
        name: 'directives',
        meta: {
          title: '指令',
          icon: 'menu-menu_animation',
        },
        component: () => import('@/views/directives/index.vue'),
      },
      {
        path: '/other',
        name: 'other',
        meta: {
          title: '其他',
          icon: 'menu-menu_other',
        },
        component: () => import('@/views/other/index.vue'),

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
        path: '/web3D',
        name: 'web3D',
        redirect: '/test',
        meta: {
          title: 'web3D',
          icon: 'menu-menu_threejs',
        },
        children: [
          {
            path: '/test',
            name: 'test',
            component: () => import('@/views/threejs/index.vue'),
            meta: {
              title: 'demo',
            },
          },
          {
            path: '/tresjs',
            name: 'tresjs',
            component: () => import('@/views/tresjs/index.vue'),
            meta: {
              title: 'tresjs',
            },
          },
          {
            path: '/leaferjs',
            name: 'leaferjs',
            component: () => import('@/views/leaferjs/index.vue'),
            meta: {
              title: 'leaferjs',
            },
          },
        ],
      },
      {
        path: '/gsap',
        name: 'gsap',
        component: () => import('@/views/gsap/index.vue'),
        meta: {
          title: 'gsap',
          icon: 'menu-menu_gsap',
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
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录',
    },
  },
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
