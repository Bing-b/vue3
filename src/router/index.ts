import { createRouter, createWebHistory } from "vue-router";
import { mainRoutes , staticRoutes } from "./route";

import NProgress from 'nprogress'; // 引入进度条插件
import 'nprogress/nprogress.css';


const router = createRouter({
  history: createWebHistory("/"),
  routes: mainRoutes.concat(staticRoutes),
});

// 配置进度条
NProgress.configure({ showSpinner: true }); 

// 路由前置守卫
router.beforeEach((to, from, next) => {
  if(to.meta.title) NProgress.start();
  if(to.path === 'home') {
    next({ path: '/home' });
    NProgress.done();
  }else {
    next();
    NProgress.done();
  }
})


export default router;
