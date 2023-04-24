import { RouteRecordRaw } from "vue-router";

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
        redirect: '/page2',
        component: () => import('@/views/home/index.vue'),
        meta: {
          title: '栏目1',
          icon: 'Discount',
        },
        children:[
          {
            path: '/page2',
            name: 'page2',
            component: () => import('@/views/page2/index.vue'),
            meta: {
              title: '子3',
              icon: 'MilkTea',
            },
          },
        ]
      },
      {
        path: '/page1',
        name: 'page1',
        component: () => import('@/views/page1/index.vue'),
        meta: {
          title: '栏目2',
          icon: 'PieChart',
        },
      },
    ]
  },
];