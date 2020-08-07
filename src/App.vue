<template>
  <div id="app">
    <!-- <Hw/>
    <Hw2/> -->
    <!-- <img alt="Vue logo" src="./assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" /> -->
    <!-- <Etab/> -->
    <!-- <div><router-link to="/hw">Hw</router-link></div>
    <router-link to="/etab">Etab</router-link>
    <hr> -->
    <router-view></router-view>
  </div>
</template>

<script>
//import HelloWorld from "./components/HelloWorld.vue";
// import Hw from "./components/Hw.vue";
// import Hw2 from "./components/Hw2.vue";
//import Etab from "./components/Etab.vue"; 
export default {
  name: "App",
  components: {
    //HelloWorld,
    // Hw,
    // Hw2,
    //Etab
  },
  created() {
    // console.log("this.$socket:", this.$socket);
    // console.log("this.sockets:", this.sockets);
    //console.log("在App组件的created生命周期中测试vue-socket.io");
    // //发送信息给服务端
    // this.$socket.emit("login", {
    //   username: "username",
    //   password: "password",
    // });

    //接收服务端的信息
    // this.$socket.on("relogin", (data) => {
    //   console.log(data);
    // });
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
