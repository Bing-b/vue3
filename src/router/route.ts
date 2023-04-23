import { RouteRecordRaw } from "vue-router";

export const mainRoutes: Array<RouteRecordRaw> = [
  { path: "/", redirect: "/home" },
  {
    path: "/home",
    name: "home",
    component: () => import("@/layout/index.vue"),
  },
];
