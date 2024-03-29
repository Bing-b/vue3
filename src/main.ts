import { createApp } from "vue";
import '@/theme/index.scss';
import App from "./App.vue";
import { createPinia } from 'pinia';
import piniaPersist from 'pinia-plugin-persist'; // pinia 持久化存储插件
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import * as ElIcons from "@element-plus/icons-vue";
import router from "./router";
import mitt from "mitt"; // 事件总线
import 'virtual:svg-icons-register' // svg
import utils from '@/utils/commonFuction'
import 'element-plus/theme-chalk/dark/css-vars.css'
import { ElTable, ElTableColumn } from 'element-plus'
import { MotionPlugin } from "@vueuse/motion";
import intro from 'intro.js'
import 'intro.js/introjs.css' 
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

// 获取el-table组件props
const tableProps = ElTable.props;
const tableColumnProps = ElTableColumn.props;

tableProps.border = {type:Boolean,default: true};
tableColumnProps.align = {type:Boolean,default: 'center'};
tableColumnProps.showOverflowTooptip = {type:Boolean,default: true}

const app = createApp(App);
app
.use(MotionPlugin)
.use(createPinia().use(piniaPersist))
.use(router)
.use(ElementPlus)
.mount("#app");

for (const [key, component] of Object.entries(ElIcons)) {
  app.component(key, component);
}

app.config.globalProperties.mittBus = mitt();
app.config.globalProperties.$getImg = utils.getImg; 
app.config.globalProperties.$formatSize = utils.formatSize; 
app.config.globalProperties.$intro = intro;
app.config.globalProperties.$sendMessage = utils.message;