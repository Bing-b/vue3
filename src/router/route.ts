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
        component: () => import('@/views/home/index.vue'),
        meta: {
          title: '首页',
          icon: 'menu-menu_home',
        }
      },
      {
        path: '/components',
        name: 'components',
        redirect:'/tree',
        meta: {
          title: '组件',
          icon: 'menu-menu_style',
        },
        children:[
          {
            path: '/tree',
            name: 'tree',
            component: () => import('@/views/tree/index.vue'),
            meta: {
              title: '植树',
            },
          },
          {
            path: '/lazyTree',
            name: 'lazyTree',
            component: () => import('@/views/lazyTree/index.vue'),
            meta: {
              title: '懒树',
            },
          },
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
          {
            path: '/ace',
            name: '代码编辑器',
            component: () => import('@/views/AceEditor/index.vue'),
            meta: {
              title: '代码编辑器',
            },
          },
          {
            path: '/tabs',
            name: '标签页',
            component: () => import('@/views/tabs/index.vue'),
            meta: {
              title: '标签页',
            },
          }
        ]
      },

      {
        path: '/garph',
        name: 'garph',
        redirect:'/G6',
        meta: {
          title: '可视化',
          icon: 'menu-menu_graph',
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
            path: '/echartGraph',
            name: 'echartGraph',
            component: () => import('@/views/echartGraph/index.vue'),
            meta: {
              title: 'echartGraph',
              icon: 'other',
            },
          },
        ]
      },
      {
        path: '/animation',
        name: 'animation',
        redirect:'/btn',
        meta: {
          title: '交互',
          icon: 'menu-menu_animation',
        },
        children: [
          {
            path: '/btn',
            name: 'btn',
            component: () => import('@/views/wComponents/index.vue'),
            meta: {
              title: '按钮组件',
            },
          },  
          {
            path: '/progress',
            name: 'progress',
            component: () => import('@/views/progress/index.vue'),
            meta: {
              title: '模拟进度',
            },
          },
        ]
      },
      {
        path: '/other',
        name: 'other',
        redirect:'/lottieWeb',
        meta: {
          title: '其他',
          icon: 'menu-menu_other',
        },
        children:[
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
          
        ]
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