import { createRouter, createWebHistory } from "vue-router";
import { mainRoutes } from "./route";

const router = createRouter({
  history: createWebHistory("/"),
  routes: mainRoutes,
});

export default router;
