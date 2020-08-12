import Vue from "vue";
import VueRouter from "vue-router";
import Hw from "../components/Hw.vue";
import Etab from "../components/Etab.vue";
import Hello from "../components/Hello.vue";

Vue.use(VueRouter);

const routes = [
  { path: "/", component: Hello },
  { path: "/hw", component: Hw },
  { path: "/etab", component: Etab },
];

const router = new VueRouter({
  routes,
});

//目前就先用全局前置守卫
// router.beforeEach((to, from, next) => {
//   // ...
//   //console.log("to:", to);
//   //console.log("from:", from);
//   if (to.path === "/etab") {
//     //console.log(sessionStorage.getItem("tabs"));
//     //console.log(typeof(sessionStorage.getItem("tabs")))
//     const sessions = JSON.parse(sessionStorage.getItem("tabs"));
//    // console.log(Array.isArray(sessions))
//     if(sessions)
//     sessions.forEach(item=>console.log(item));
//   }
//   next();
//   //console.log("next:", next);
// });

export default router;
