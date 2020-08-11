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
        @tab-click="handleclick"
      >
        <!-- @tab-click="handleclick" -->
        <el-tab-pane
          v-for="(item, index) in editableTabs"
          :key="item.name"
          :label="item.title"
          :name="item.name"
        >
          <div class="divtabpame" style="border: 1px solid yellow;">
            websocket--{{ item.content }}--{{ index + 1 }}
            <br />
            <br />
            <button @click="clickButton(false)">
              在Etab组件中：socket建立连接
            </button>

            <br />
            <br />
            <button @click="cancelConnect">在Etab组件中：socket断开连接</button>
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
      socketIds: [],
    };
  },
  methods: {
    addTab(targetName) {
      let newTabName = ++this.tabIndex + "";
      let newTabName1 = "客户端" + newTabName;
      console.log("targetName:", targetName, typeof newTabName);

      this.editableTabs.push({
        title: newTabName1,
        name: newTabName,
        content: newTabName1,
      });

      this.editableTabsValue = newTabName;
      sessionStorage.setItem("editableTabs", JSON.stringify(this.editableTabs));
      sessionStorage.setItem("editableTabsValue", this.editableTabsValue);
    },

    removeTab(targetName) {
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

      sessionStorage.setItem("editableTabs", JSON.stringify(this.editableTabs));
      sessionStorage.setItem("editableTabsValue", this.editableTabsValue);

      //todo其实关闭之后，取消连接的操作在在这里写
    },

    clickButton: function(flg) {
      if (flg) {
        this.sockets = [];
        for (let i = 0; i < this.socketIds.length; i++) {
          let roomNum = "room" + this.socketIds[i];
          let socket1 = io("http://localhost:3000");
          socket1.on("connect", (obj) => {
            console.log("created:建立连接成功了：", obj, socket1.id);
            let obj1 = {};
            obj1[this.socketIds[i]] = socket1;
            this.sockets.push(obj1);
            console.log(
              `created:现在已经有${this.sockets.length}个客户端与服务端建立连接了,依次打出他们的socket.id：`
            );

            this.sockets.forEach((item) => {
              console.log(item);
              console.log(item[Object.keys(item)[0]]);
            });
            // if (flg && i === 0) {
            //   socket1.emit("clearAll");
            // }
            socket1.emit("enterRoom", {
              roomNum: roomNum,
            });
          });
          // socket1.on(roomNum, (obj) => {
          //   console.log("created:接收特定房间的消息：", obj);
          // });

          // socket1.on("a new user has joined the room", (obj) => {
          //   console.log(
          //     roomNum,
          //     "created:接收到来自服务端的a new user has joined the room消息：",
          //     obj
          //   );
          // });

          socket1.on("disconnect", (reason) => {
            this.sockets = this.sockets.filter(
              (item) => item[Object.keys(item)[0]].connected === true
            );
            console.log("created:this.sockets:", this.sockets.length);
            this.sockets.forEach((item) =>
              console.log("created:22item:", item)
            );
            console.log("disconnect1111:", reason);
          });
        }
      } else {
        let clickTab = this.editableTabs[
          this.editableTabs.findIndex(
            (item) => item.name === this.editableTabsValue
          )
        ];
        let roomNum = "room" + clickTab.name;

        let socket1 = io("http://localhost:3000"); //todo，服务器地址

        //事件connect
        socket1.on("connect", (obj) => {
          console.log("建立连接成功了：", obj, socket1.id);
          let obj1 = {};
          obj1[this.editableTabsValue] = socket1;
          this.sockets.push(obj1);
          this.socketIds.push(clickTab.name);
          console.log(
            `现在已经有${this.sockets.length}个客户端与服务端建立连接了,依次打出他们的socket.id：`
          );

          this.sockets.forEach((item) => {
            console.log(item);
            console.log(item[Object.keys(item)[0]]);
          });

          sessionStorage.setItem("socketIds", JSON.stringify(this.socketIds));
          //发送房间号码,要在connect事件的外部注册，这样在重新连接的时候才不会再次被注册
          socket1.emit("enterRoom", {
            roomNum: roomNum,
          });
        });

        socket1.on(roomNum, (obj) => {
          console.log("接收特定房间的消息：", obj);
        });

        socket1.on("a new user has joined the room", (obj) => {
          console.log(
            clickTab.name,
            "，接收到来自服务端的a new user has joined the room消息：",
            obj
          );
        });

        socket1.on("disconnect", (reason) => {
          this.sockets = this.sockets.filter(
            (item) => item[Object.keys(item)[0]].connected === true
          );
          console.log("this.sockets:", this.sockets.length);
          this.sockets.forEach((item) => console.log("22item:", item));
          console.log("disconnect1111:", reason);
          //}
          // else the socket will automatically try to reconnect
        });

        // socket1.on("ferret", (name, fn) => {
        //   console.log("ferret>name:", name);
        //   fn("woot");
        // });
      } //elseslese
    },

    cancelConnect() {
      const activeTab = this.editableTabsValue;
      let tabClose = this.sockets.find((item) => item[activeTab] !== undefined);

      this.socketIds.splice(
        this.socketIds.findIndex((item) => item === activeTab),
        1
      );

      sessionStorage.setItem("socketIds", JSON.stringify(this.socketIds));
      tabClose[activeTab].close(); //这个地方不能emit事件，所以只有在服务端循环找到是哪个tab关闭了连接
    },

    handleclick(tab, event) {
      console.log("tab, event:", tab, event);
      sessionStorage.setItem("editableTabsValue", tab.name);
    },
  },

  created() {
    console.log("created");
    const socketIds = JSON.parse(sessionStorage.getItem("socketIds"));
    const editableTabs = JSON.parse(sessionStorage.getItem("editableTabs"));
    const editableTabsValue = sessionStorage.getItem("editableTabsValue");
    if (editableTabs) {
      let maxindex = parseInt(editableTabs[0].name);
      for (let i = 1; i < editableTabs.length; i++) {
        if (parseInt(editableTabs[i].name) > maxindex) {
          maxindex = parseInt(editableTabs[i].name);
        }
      }
      this.editableTabs = editableTabs;
      this.editableTabsValue = editableTabsValue;
      this.tabIndex = maxindex;
    }
    if (socketIds) {
      this.socketIds = socketIds;
      console.log("sockets:", this.sockets);
      //
      this.clickButton(true);
    }
  },
  //或者将其放在created函数中

  // beforeRouteEnter(to, from, next) {
  //   // 在渲染该组件的对应路由被 confirm 前调用
  //   // 不！能！获取组件实例 `this`
  //   // 因为当守卫执行前，组件实例还没被创建
  //   // console.log("to:", to);
  //   // console.log("from:", from);
  //   // console.log("next:", next);
  //   // if (to.path === "/etab") {
  //   //   const sessions = JSON.parse(sessionStorage.getItem("editableTabs"));
  //   //   if (sessions) sessions.forEach((item) => console.log(item));
  //   // }
  //   next((vm) => {
  //     //console.log(vm.$data.editableTabs);
  //     const sessions = JSON.parse(sessionStorage.getItem("editableTabs"));
  //     const editableTabsValue = sessionStorage.getItem("editableTabsValue");
  //     if (sessions) {
  //       //sessions.forEach((item) => console.log(item));
  //       let maxindex = parseInt(sessions[0].name);
  //       //console.log("maxindex:",parseInt(sessions[1].name))
  //       for (let i = 1; i < sessions.length; i++) {
  //         if (parseInt(sessions[i].name) > maxindex) {
  //           maxindex = parseInt(sessions[i].name);
  //         }
  //       }
  //       vm.$data.editableTabs = sessions;
  //       vm.$data.editableTabsValue = editableTabsValue;
  //       vm.$data.tabIndex = maxindex;
  //       //console.log("maxindex:",vm.$data.editableTabsValue)
  //     }
  //   });
  // },
};
</script>
<style scoped>
div.divtabpame {
  height: 120px;
}
</style>
