import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import piniaPersist from 'pinia-plugin-persist'; // pinia 持久化存储插件
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as ElIcons from '@element-plus/icons-vue';
import router from './router';
import mitt from 'mitt'; // 事件总线
import 'virtual:svg-icons-register'; // svg
import utils from '@/utils/commonFuction';
import 'element-plus/theme-chalk/dark/css-vars.css';
import { MotionPlugin } from '@vueuse/motion';
import intro from 'intro.js'; // 引导页
import 'intro.js/introjs.css';
import '@/theme/index.scss';
import 'element-plus/dist/index.css';
import directives from '@/directives/index'; // 自定义指令
import '@/theme/style.css';

const app = createApp(App);
app
  .use(MotionPlugin)
  .use(createPinia().use(piniaPersist))
  .use(directives)
  .use(router)
  .use(ElementPlus)
  .mount('#app');

for (const [key, component] of Object.entries(ElIcons)) {
  app.component(key, component);
}

app.config.globalProperties.mittBus = mitt();
app.config.globalProperties.$getImg = utils.getImg;
app.config.globalProperties.$formatSize = utils.formatSize;
app.config.globalProperties.$intro = intro;
app.config.globalProperties.$sendMessage = utils.message;
app.config.idPrefix = 'app'; // 配置全局
