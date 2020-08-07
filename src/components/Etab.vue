<template>
  <div style="border: 1px solid blueviolet;">
    <router-link to="/">返回首页</router-link>
    <div style="border: 1px solid red;">
      <div style="border: 1px solid green;margin-bottom: 20px;">
        <el-button size="small" @click="addTab(editableTabsValue)">
          add tab
        </el-button>
      </div>
      <el-tabs
        v-model="editableTabsValue"
        type="card"
        closable
        @tab-remove="removeTab"
      >
        <!-- @tab-click="handleclick" -->
        <el-tab-pane
          v-for="(item, index) in editableTabs"
          :key="item.name"
          :label="item.title"
          :name="item.name"
        >
          <div class="divtabpame" style="border: 1px solid yellow;">
            websocket--{{ item.content }}--{{ index }}
            <br />
            <br />
            <button @click="clickButton">在Etab组件中：socket建立连接</button>

            <br />
            <br />
            <button @click="clickButton1">在Etab组件中：socket断开连接</button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import io from "socket.io-client";
export default {
  name: "Etab",
  data() {
    return {
      editableTabsValue: "2",
      editableTabs: [
        {
          title: "Tab 1",
          name: "1",
          content: "Tab 1 content",
        },
        {
          title: "Tab 2",
          name: "2",
          content: "Tab 2 content",
        },
      ],
      tabIndex: 2,
      //socket: [],
      socket: {},
      sockets: [],
      maps: [],
    };
  },
  methods: {
    addTab(targetName) {
      let newTabName = ++this.tabIndex + "";
      let newTabName1 = "客户端" + newTabName;
      console.log("targetName:", targetName);
      console.log("newTabName:", newTabName);
      this.editableTabs.push({
        title: newTabName1,
        name: newTabName,
        content: newTabName1,
      });
      this.editableTabsValue = newTabName;
    },
    removeTab(targetName) {
      //删除的地方有问题
      let tabs = this.editableTabs;
      let activeName = this.editableTabsValue;
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
            }
          }
        });
      }

      this.editableTabsValue = activeName;
      this.editableTabs = tabs.filter((tab) => tab.name !== targetName);
      // if(socket1){

      // }
      //socket1.close(); //关掉了连接
      // socket1.on("disconnect", (reason) => {
      //   // if (reason === "io server disconnect") {
      //   //   // the disconnection was initiated by the server, you need to reconnect manually
      //   //   socket.connect();
      //   // }
      //   // // else the socket will automatically try to reconnect
      //   console.log("reason:", reason);
      // });//这个事件不起作用
    },
    clickButton: function() {
      //console.log(this.editableTabs[this.editableTabs.findIndex((item)=>item.name===this.editableTabsValue)]);
      //editableTabs.name =
      //哪个标签页
      let eventName = this.editableTabs[
        this.editableTabs.findIndex(
          (item) => item.name === this.editableTabsValue
        )
      ];
      let eN = "room" + eventName.name;
      //socket1.push({eventName:io("http://localhost:3000")});
      let socket1 = io("http://localhost:3000");

      // console.log("eventName.name--socket1:", eventName.name, socket1.id);

      //事件connect
      socket1.on("connect", (obj) => {
        // ...
        console.log("建立连接成功了：", obj, socket1.id);
        let obj1 = {};
        obj1[this.editableTabsValue] = socket1;
        this.sockets.push(obj1);
        console.log(
          `现在已经有${this.sockets.length}个客户端与服务端建立连接了,依次打出他们的socket.id：`
        );
        this.sockets.forEach((item) => {
          console.log(item);
        });
      });

      socket1.emit("login", {
        username: eN,
      });
      socket1.on("relogin", (obj) => {
        console.log(
          eventName.name,
          "这是Etab，接收到来自服务端的relogin消息：",
          obj,
          socket1.id
        );
      });
      // socket1.on("serverEmit", (obj) => {
      //   console.log(
      //     eventName.name,
      //     "这是Etab，接收到来自服务端的serverEmit消息：",
      //     obj
      //   );
      // });
      // socket1.on("sEmit", (obj) => {
      //   console.log(
      //     eventName.name,
      //     "这是Etab，接收到来自服务端的sEmit消息：",
      //     obj
      //   );
      // });
      // setInterval(() => {
      //   socket.emit("etabEmit", {
      //     message: "Etab的etabEmit：setTimeout这是Etab客户端emit的",
      //   });
      // }, 3000);

      socket1.on("a new user has joined the room", (obj) => {
        console.log(
          eventName.name,
          "这是Etab，接收到来自服务端的a new user has joined the room消息：",
          obj
        );
      });
      // socket1.on(eventName.name, (obj) => {
      //   console.log(
      //     eventName.name,
      //     "这是Etab，接收到来自服务端的a new user has joined the room消息：",
      //     obj
      //   );
      // });

      socket1.on("ferret", (name, fn) => {
        console.log("ferret>name:", name);
        fn("woot");
      });

      socket1.on(eventName.name, (obj) => {
        console.log("接收特定房间里的消息", obj);
      });

      socket1.on("disconnect", (reason) => {
        //if (reason === "io server disconnect") {
        // the disconnection was initiated by the server, you need to reconnect manually
        //socket.connect();
        console.log("disconnect1111:", reason);
        //}
        // else the socket will automatically try to reconnect
      });
    },
    clickButton1(event) {
      console.log("event:", event);
      //this.sockets
      console.log("this.sockets:", this.sockets);
      //console.log("this.sockets:",socket1);
      console.log(
        this.sockets.find((item) => item[this.editableTabsValue] !== undefined)[
          this.editableTabsValue
        ]
      );
      //客户端还需要发消息：让服务器断开与该客户端的连接
      // this.sockets
      //   .find((item) => item[this.editableTabsValue] !== undefined)[this.editableTabsValue].emit("");
      (this.sockets
        .find((item) => item[this.editableTabsValue] !== undefined)[this.editableTabsValue]).close();

      (this.sockets
        .find((item) => item[this.editableTabsValue] !== undefined)[this.editableTabsValue]).on("disconnect", (reason) => {
          //if (reason === "io server disconnect") {
          // the disconnection was initiated by the server, you need to reconnect manually
          //socket.connect();
          console.log("disconnect2222:", reason);
          //}
          // else the socket will automatically try to reconnect
        });
      //同时将数组中这个对象删掉
      this.sockets.splice(
        this.sockets.findIndex(
          (item) => item[this.editableTabsValue] !== undefined
        ),
        1
      );
    },
    // handleclick(tab, event) {
    //console.log(tab, event);
    //console.log(tab.name, event);
    // },
  },
};
</script>
<style scoped>
div.divtabpame {
  height: 120px;
}
</style>
