import Vue from "vue";
import App from "./App.vue";

// main.js
import tinymce from "tinymce/tinymce";
// 👇 关键：强制使用本地资源，禁止访问 cdn.tiny.cloud
tinymce.baseURL = "/tinymce";

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.use(ElementUI);

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount("#app");
