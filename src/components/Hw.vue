<template>
  <div class="hello">
    <router-link to="/">返回首页</router-link>
    <br />
    <button @click="clickButton">在Hw组件中：socket建立连接</button>
  </div>
</template>

<script>
import io from "socket.io-client";
import { store, mutations } from "../store";
export default {
  name: "Hw",
  props: {
    msg: String,
  },
  created() {
    console.log("created>Hw");
    console.log(
      "mutations,store.name,store.message，store.socket:",
      mutations,
      store.name,
      store.message,
      store.socket
    );
  },
  methods: {
    clickButton: function() {
      // $socket is socket.io-client instance
      //this.$socket.emit('emit_method', data)
      //console.log("io:", io);
      //console.log("data:", data);
      const socket = io("http://localhost:3000");
      socket.emit("login", {
        username: "hi,这是Hw组件发送的消息login",
      });
      socket.on("relogin", (obj) => {
        console.log("这是hw，接收到来自服务端的relogin消息：", obj);
      });
      // socket.on("serverEmit", (obj) => {
      //   console.log("这是hw，接收到来自服务端的serverEmit消息：", obj);
      // });
      // socket.on("sEmit", (obj) => {
      //   console.log("这是hw，接收到来自服务端的sEmit消息：", obj);
      // });
      // setInterval(() => {
      //   socket.emit("cEmit", {
      //     message: "Hw的cEmit：setTimeout这是Hw客户端emit的",
      //   });
      // }, 3000);

      setInterval(() => {
        socket.emit("hwEmit", {
          message: "hw的etabEmit：setTimeout这是hw客户端emit的",
        });
      }, 3000);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
