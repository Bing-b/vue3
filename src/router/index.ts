import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router';
import { mainRoutes, staticRoutes } from './route';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

const router = createRouter({
  // history: createWebHistory('/'),
  history: createWebHistory(import.meta.env.VITE_PUBLIC_PATH),
  //history: createWebHashHistory(),
  routes: mainRoutes.concat(staticRoutes),
});

// 配置进度条
NProgress.configure({
  easing: 'ease', // 动画方式
  speed: 500, // 递增进度条的速度
  showSpinner: false, // 是否显示圆圈加载
  trickleSpeed: 200, // 自动递增间隔
  minimum: 0.3, // 初始化时的最小百分比
});

// 路由前置守卫
router.beforeEach((to, from, next) => {
  NProgress.start();
  next();
  // if (to.path === '/' && from.path !== '/home') {
  //   next({ path: '/home' });
  // } else {
  //   next();
  // }
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
