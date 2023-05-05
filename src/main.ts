import { createApp } from "vue";
import "./style.css";
import '@/theme/index.scss';
import App from "./App.vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import * as ElIcons from "@element-plus/icons-vue";
import router from "./router";
import mitt from "mitt"; // 事件总线

import 'virtual:svg-icons-register' // svg

const app = createApp(App);
app.use(ElementPlus);
app.use(router).mount("#app");

for (const [key, component] of Object.entries(ElIcons)) {
  app.component(key, component);
}

app.config.globalProperties.mittBus = mitt();
