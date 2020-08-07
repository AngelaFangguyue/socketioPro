import Vue from "vue";
import VueRouter from "vue-router";
import Hw from "../components/Hw.vue";
import Etab from "../components/Etab.vue";
import HelloWorld from "../components/HelloWorld.vue";
Vue.use(VueRouter);

const routes = [
  { path: "/", component: HelloWorld },
  { path: "/hw", component: Hw },
  { path: "/etab", component: Etab },
];

const router = new VueRouter({
  routes, // (缩写) 相当于 routes: routes
});

export default router;
