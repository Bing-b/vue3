import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router';
import { mainRoutes, staticRoutes } from './route';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import useUserStore from '@/store/modules/user';

const router = createRouter({
  history: createWebHistory('/'),
  //history: createWebHistory(import.meta.env.VITE_PUBLIC_PATH),
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

// 定义白名单：不需要登录就能访问的页面
const whiteList = ['/login', '/register', '/404'];

// 路由前置守卫
router.beforeEach((to, from, next) => {
  NProgress.start();

  const userStore = useUserStore();
  const hasToken = userStore.token;

  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/dashboard' });
      NProgress.done();
    } else {
      next();
    }
  } else {
    if (whiteList.includes(to.path)) {
      next();
    } else {
      next(`/login?redirect=${to.fullPath}`);
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
