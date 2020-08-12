import Vue from "vue";
import App from "./App.vue"
import router from "./router"
import "element-ui/lib/theme-chalk/index.css"
import { Tabs, Button,TabPane } from "element-ui"
//import { store, mutations } from "../store"
Vue.use(Tabs);
Vue.use(Button);
Vue.use(TabPane);

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
