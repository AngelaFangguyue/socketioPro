import Vue from "vue";
import App from "./App.vue"
import router from "./router"
import "element-ui/lib/theme-chalk/index.css"
import { Tabs, Button,TabPane } from "element-ui"
Vue.use(Tabs);
Vue.use(Button);
Vue.use(TabPane);

//import io from "socket.io-client";

//const socket = io("http://localhost:3000");
//Vue.prototype.$socket = socket;
//console.log("main:socket:", Vue.prototype.$socket);

Vue.config.productionTip = false;

//import VueSocketIO from 'vue-socket.io'

// Vue.use(new VueSocketIO({
//     debug: true,
//     // 服务器端地址
//     connection: 'http://localhost:3000',
//     vuex: {
//     }
// }))

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
