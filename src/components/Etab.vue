<template>
  <div style="border: 1px solid blueviolet;">
    <router-link to="/">返回首页</router-link>
    <router-link to="/hw">返回Hw</router-link>
    <div style="border: 1px solid red;">
      <div style="border: 1px solid green; margin-bottom: 20px;">
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
import { store, mutations } from "../store";
export default {
  name: "Etab",
  computed: {
    socketstore() {
      return store.socket;
    },
  },
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
      socket: {},
      sockets: [],
      socket1: {},
      flg: "",
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

    clickButton: function() {
      let clickTab = this.editableTabs[
        this.editableTabs.findIndex(
          (item) => item.name === this.editableTabsValue
        )
      ];
      let roomNum = "room" + clickTab.name;
      console.log("clickButton,roomNUm:", roomNum);
      mutations.setName("gdd");

      //this.socketIds.push(clickTab.name);
      //sessionStorage.setItem("socketIds", JSON.stringify(this.socketIds));
      //////////////////////////////////////////////////

      //if (Object.keys(this.socketstore).indexOf("acks") > -1) {
      if (Object.keys(this.socket1).indexOf("acks") > -1) {
        console.log(
          "空this.flg,this.socket1,this.socketstore:",
          this.flg,
          this.socket1,
          this.socketstore
        );

        //this.socket1 = this.socketstore;
      } else {
        console.log("真this.flg:", this.flg, this.socketstore);
        this.flg = true;
        this.socket1 = io("http://localhost:3000");

        //事件connect
        this.socket1.on("connect", (obj) => {
          console.log("建立连接成功了：", obj, this.socket1.id);
        });

        this.socket1.on("reconnect", () => {
          console.log("reconnect");
          // this.socket1.emit("enterRoom", {
          //   roomNum: roomNum,
          // });
        });

        this.socket1.on("disconnect", (reason) => {
          sessionStorage.setItem("newConnect", "true");
          console.log("disconnect1111:", reason);
          //}
          // else the socket will automatically try to reconnect
        });

        this.socket1.on("clientmessage", (obj) => {
          mutations.setMessage(obj.sendmesg);
        }); //这个必须放在外面

        mutations.setSocket(this.socket1);
      }

      this.socket1.emit("enterRoom", {
        roomNum: roomNum,
      });

      let connectTabs = JSON.parse(sessionStorage.getItem("connectTabs"));
      if (!connectTabs) {
        connectTabs = [];
      }
      connectTabs.push(roomNum);
      sessionStorage.setItem("connectTabs", JSON.stringify(connectTabs));
    },

    cancelConnect() {
      //const activeTab = this.editableTabsValue;
      let clickTab = this.editableTabs[
        this.editableTabs.findIndex(
          (item) => item.name === this.editableTabsValue
        )
      ];
      let roomNum = "room" + clickTab.name;

      console.log("准备触发leaveRoom事件");
      this.socket1.emit("leaveRoom", { roomNum: roomNum });

      let connectTabs = JSON.parse(sessionStorage.getItem("connectTabs"));
      if (!connectTabs) {
        connectTabs = [];
      }
      connectTabs.splice(connectTabs.findIndex((item) => item === roomNum));
      sessionStorage.setItem("connectTabs", JSON.stringify(connectTabs));
    },

    handleclick(tab, event) {
      console.log("tab, event:", tab, event);
      sessionStorage.setItem("editableTabsValue", tab.name);
    },
  },

  created() {
    console.log("created>Etab");
    console.log(
      "mutations,store.name,store.message，store.socket,this.socketstore:",
      mutations,
      store.name,
      store.message,
      store.socket,
      this.socketstore
    );
    //console.log("this.sockets:", this.sockets);

    const editableTabs = JSON.parse(sessionStorage.getItem("editableTabs"));
    if (editableTabs) {
      let maxindex = parseInt(editableTabs[0].name);
      for (let i = 1; i < editableTabs.length; i++) {
        if (parseInt(editableTabs[i].name) > maxindex) {
          maxindex = parseInt(editableTabs[i].name);
        }
      }
      this.editableTabs = editableTabs;
      this.editableTabsValue = sessionStorage.getItem("editableTabsValue");
      this.tabIndex = maxindex;
    }

    //先看全局数据里有没有连接，有的话，把连接给this.socket1
    if (Object.keys(store.socket).indexOf("acks") > -1) {
      this.socket1 = store.socket;
    }

    //const newConnect = sessionStorage.getItem("newConnect");
    //if (newConnect === "true") {
    //  console.log("已经建立过连接");
    //} else {
    //  console.log("还未建立过连接");
    //}

    let connectTabs = JSON.parse(sessionStorage.getItem("connectTabs"));
    if (!connectTabs) {
      connectTabs = [];
    }
    console.log("created>>>>connectTabs:", connectTabs);
    if ((Object.keys(store.socket).indexOf("acks") <= -1) && connectTabs && connectTabs.length > 0) {
      this.socket1 = io("http://localhost:3000");
      for (let i = 0; i < connectTabs.length; i++) {
        this.socket1.emit("enterRoom", {
          roomNum: connectTabs[i],
        });
      }
    }
  },

  // beforeDestroy() {
  //   console.log("beforeDestroy:触发disconnect事件");
  //   // this.socket1.emit("disc");
  //   if (Object.keys(this.socket1).indexOf("acks") > -1) {
  //     this.socket1.close();
  //   }
  // },

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
