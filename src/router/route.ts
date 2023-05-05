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
              title: '树型目录',
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
          icon: 'dinosaur',
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