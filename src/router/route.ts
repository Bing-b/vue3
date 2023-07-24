import { RouteRecordRaw } from "vue-router";

/**
 * 功能页面路由
 */
export const mainRoutes: Array<RouteRecordRaw> = [
  { path: "/", redirect: "/home" },
  {
    path: "/home",
    name: "home",
    component: () => import("@/layout/index.vue"),
    children: [
      {
        path: '/home',
        name: 'home',
        redirect: '/tree',
        component: () => import('@/views/home/index.vue'),
        meta: {
          title: '首页',
          icon: 'home',
        },
        children:[
          {
            path: '/tree',
            name: 'tree',
            component: () => import('@/views/tree/index.vue'),
            meta: {
              title: '植树',
              icon: 'Memo',
            },
          },
          {
            path: '/lazyTree',
            name: 'lazyTree',
            component: () => import('@/views/lazyTree/index.vue'),
            meta: {
              title: '懒树',
              icon: 'Memo',
            },
          },
          {
            path: '/elTable',
            name: 'elTable',
            component: () => import('@/views/elTable/index.vue'),
            meta: {
              title: '全局配置',
              icon: 'Memo',
            },
          },
        ]
      },
      {
        path: '/aceEditor',
        name: 'aceEditor',
        component: () => import('@/views/AceEditor/index.vue'),
        meta: {
          title: '代码编辑',
          icon: 'edit',
        },
      },
      {
        path: '/annotation',
        name: 'annotation',
        component: () => import('@/views/TextAnnotation/index.vue'),
        meta: {
          title: '文本标注',
          icon: 'mark',
        },
      },
      {
        path: '/lottieWeb',
        name: 'lottieWeb',
        component: () => import('@/views/lottieWeb/index.vue'),
        meta: {
          title: 'Lottie 动画',
          icon: 'animate',
        },
      },
      {
        path: '/skeleton',
        name: '骨架',
        component: () => import('@/views/skeleton/index.vue'),
        meta: {
          title: '骨架',
          icon: 'bood',
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
      {
        path: '/drawGraph',
        name: '绘图',
        redirect: '/G6',
        meta: {
          title: '绘图',
          icon: 'inside',
        },
        children: [
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
            path: '/gdm',
            name: 'gdm',
            component: () => import('@/views/gdm/index.vue'),
            meta: {
              title: 'dgm绘图',
              icon: 'other',
            },
          },
        ]
      },
      {
        path: '/components',
        name: '组件',
        redirect: '/upload',
        meta: {
          title: '组件',
          icon: 'component',
        },
        children: [
          {
            path: '/upload',
            name: 'upload',
            component: () => import('@/views/upload/index.vue'),
            meta: {
              title: 'upload',
              icon: 'other',
            },
          },
          {
            path: '/div',
            name: '拖拽div',
            component: () => import('@/views/dragDiv/index.vue'),
            meta: {
              title: '拖拽div',
              icon: 'other',
            },
          },
        ]
      },
      
      {
        path: '/animation',
        name: '交互',
        component: () => import('@/views/wComponents/index.vue'),
        meta: {
          title: '交互',
          icon: 'other',
        },
      },
      {
        path: '/other',
        name: '其他',
        component: () => import('@/views/other/index.vue'),
        meta: {
          title: '其他',
          icon: 'other',
        },
      },

      

    ]
  },
];

/**
 * 定义静态路由
 * @description 用于固定的静态页面
 * @returns 返回路由菜单数据
 */
export const staticRoutes:Array<RouteRecordRaw> = [
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
      title: 'message.staticRoutes.notFound'
    }
  },
  /**
   * 定义404界面
   * @link 参考：https://next.router.vuejs.org/zh/guide/essentials/history-mode.html#netlify
   */
  {
    path: '/:pathMatch(.*)',
    redirect: '/404',
  }
]