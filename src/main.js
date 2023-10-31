import Vue from 'vue'
import App from './App.vue'
import {Button,Dialog,Input,Message,Tabs,TabPane} from 'element-ui';
import utils from './plugins/utils';
import router from './router';
import store from "./store/state";
import axios from './plugins/axios';
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'

Vue.use(Button);
Vue.use(Dialog);
Vue.use(Input);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.prototype.$message = Message;
Vue.prototype.$utils = utils;

Vue.prototype.axios = axios;
axios.defaults.withCredentials = true; // 允许携带cookie

Vue.config.productionTip = false;

const requireComponent = require.context(
  // 其组件目录的相对路径
  "./components/baseComponents",
  // 是否查询其子目录
  false,
  // 匹配基础组件文件名的正则表达式
  /\.vue$/
);

requireComponent.keys().forEach(fileName => {
  // 获取组件配置
  const componentConfig = requireComponent(fileName);

  // 获取组件的 PascalCase 命名
  const componentName = upperFirst(
    camelCase(
      // 获取和目录深度无关的文件名
      fileName
        .split("/")
        .pop()
        .replace(/\.\w+$/, "")
    )
  );

  // 全局注册组件
  Vue.component(
    componentName,
    // 如果这个组件选项是通过 `export default` 导出的，
    // 那么就会优先使用 `.default`，
    // 否则回退到使用模块的根。
    componentConfig.default || componentConfig
  );
});

new Vue({
  router,
  store,
  axios,
  render: h => h(App)
}).$mount('#app')
