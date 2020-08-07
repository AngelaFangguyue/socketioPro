<template>
  <div class="hello">
    <button @click="clickButton">在Hw组件中：socket建立连接</button>
  </div>
</template>

<script>
import io from "socket.io-client";

export default {
  name: "Hw",
  props: {
    msg: String,
  },

  methods: {
    clickButton: function(data) {
      // $socket is socket.io-client instance
      //this.$socket.emit('emit_method', data)
      console.log("io:", io);
      console.log("data:", data);
      const socket = io("http://localhost:3000");
      socket.emit("login", {
        username: "hi,这是Hw2组件发送的消息login",
      });
      socket.on("relogin", (obj) => {
        console.log("这是hw2，接收到来自服务端的relogin消息：", obj);
      });
      socket.on("serverEmit", (obj) => {
        console.log("这是hw2，接收到来自服务端的serverEmit消息：", obj);
      });
      socket.on("sEmit", (obj) => {
        console.log("这是hw2，接收到来自服务端的sEmit消息：", obj);
      });
      setInterval(() => {
        socket.emit("cEmit2", {
          message: "Hw2的cEmit2：setTimeout这是Hw2客户端emit的",
        });
      }, 3000);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
