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
      socketIds: [],
    };
  },
  methods: {
    addTab(targetName) {
      //sessionStorage.getItem()//找到最大的index，依次加,created
      let newTabName = ++this.tabIndex + "";
      let newTabName1 = "客户端" + newTabName;
      console.log("targetName:", targetName, typeof newTabName);
      //console.log("newTabName:", newTabName);
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

      //删除掉标签后，就将对应sessionstorage里的内容去掉
      //sessionStorage.removeItem(targetName);
      sessionStorage.setItem("editableTabs", JSON.stringify(this.editableTabs));
      sessionStorage.setItem("editableTabsValue", this.editableTabsValue);
      //todo:同时关掉连接
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
      if (flg) {
      } else {
      }
      //console.log(this.editableTabs[this.editableTabs.findIndex((item)=>item.name===this.editableTabsValue)]);
      //editableTabs.name =
      //哪个标签页
      let clickTab = this.editableTabs[
        this.editableTabs.findIndex(
          (item) => item.name === this.editableTabsValue
        )
      ];
      let roomNum = "room" + clickTab.name;
      //socket1.push({clickTab:io("http://localhost:3000")});
      let socket1 = io("http://localhost:3000"); //todo，服务器地址
      // this.sockets.forEach((item) => {
      //   console.log("129:", item);
      // });
      // console.log("clickTab.name--socket1:", clickTab.name, socket1.id);

      //事件connect
      socket1.on("connect", (obj) => {
        // this.sockets.forEach((item) => {
        //   console.log("136:",item);
        // });
        console.log("建立连接成功了：", obj, socket1.id);
        let obj1 = {};
        obj1[this.editableTabsValue] = socket1;
        this.sockets.push(obj1);
        this.socketIds.push(clickTab.name);
        console.log(
          `现在已经有${this.sockets.length}个客户端与服务端建立连接了,依次打出他们的socket.id：`
        );
        // this.sockets = this.sockets.foreach(
        //   (item) =>
        //     //console.log(item);
        //     //console.log(Object.keys(item));
        //     //console.log(item[Object.keys(item)[0]].connected,typeof(item[Object.keys(item)[0]].connected));
        //     console.log(item[Object.keys(item)[0]])

        //   // if(item[Object.keys(item)[0]].connected){
        //   //   item.flgg = true
        //   // }
        // );
        sessionStorage.setItem("socketIds", JSON.stringify(this.socketIds));
        this.sockets.forEach((item) => {
          console.log(item);
          console.log(item[Object.keys(item)[0]]);
        });

        //发送房间号码,要在connect事件的外部注册，这样在重新连接的时候才不会再次被注册
        socket1.emit("enterRoom", {
          roomNum: roomNum,
        });

        // socket1.on(roomNum, (obj) => {
        //   console.log("接收特定房间的消息：", obj);
        // });
      });
      // socket1.emit("enterRoom", {
      //   roomNum: roomNum,
      // });

      socket1.on(roomNum, (obj) => {
        console.log("接收特定房间的消息：", obj);
      });
      //////////////////////////////
      // socket1.emit("login", {
      //   username: roomNum,
      // });
      // socket1.on("relogin", (obj) => {
      //   console.log(
      //     clickTab.name,
      //     "这是Etab，接收到来自服务端的relogin消息：",
      //     obj,
      //     socket1.id
      //   );
      // });
      ///////////////////////////////
      // socket1.on("serverEmit", (obj) => {
      //   console.log(
      //     clickTab.name,
      //     "这是Etab，接收到来自服务端的serverEmit消息：",
      //     obj
      //   );
      // });
      // socket1.on("sEmit", (obj) => {
      //   console.log(
      //     clickTab.name,
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
          clickTab.name,
          "这是Etab，接收到来自服务端的a new user has joined the room消息：",
          obj
        );
      });
      // socket1.on(clickTab.name, (obj) => {
      //   console.log(
      //     clickTab.name,
      //     "这是Etab，接收到来自服务端的a new user has joined the room消息：",
      //     obj
      //   );
      // });

      socket1.on("ferret", (name, fn) => {
        console.log("ferret>name:", name);
        fn("woot");
      });

      socket1.on(clickTab.name, (obj) => {
        console.log("接收特定房间里的消息", obj);
      });

      socket1.on("disconnect", (reason) => {
        this.sockets.forEach((item) => console.log("11item:", item));
        //if (reason === "io server disconnect") {
        // the disconnection was initiated by the server, you need to reconnect manually
        //socket.connect();
        this.sockets = this.sockets.filter(
          (item) =>
            //console.log(item);
            //console.log(Object.keys(item));
            //console.log(item[Object.keys(item)[0]].connected,typeof(item[Object.keys(item)[0]].connected));
            item[Object.keys(item)[0]].connected === true

          // if(item[Object.keys(item)[0]].connected){
          //   item.flgg = true
          // }
        );

        console.log("this.sockets:", this.sockets.length);
        this.sockets.forEach((item) => console.log("22item:", item));

        console.log("disconnect1111:", reason);
        //}
        // else the socket will automatically try to reconnect
      });
    },

    clickButton1() {
      //console.log("event:", event);
      //this.sockets
      //console.log("this.sockets:", this.sockets);
      //console.log("this.sockets:",socket1);
      // console.log(
      //   this.sockets.find((item) => item[this.editableTabsValue] !== undefined)[
      //     this.editableTabsValue
      //   ]
      // );
      //客户端还需要发消息：让服务器断开与该客户端的连接
      // this.sockets
      //   .find((item) => item[this.editableTabsValue] !== undefined)[this.editableTabsValue].emit("");

      const activeTab = this.editableTabsValue;
      let tabClose = this.sockets.find((item) => item[activeTab] !== undefined);
      //console.log("tabClose11:", tabClose[activeTab]);
      //tabClose[activeTab].emit("ddis", { msg:tabClose[activeTab] });
      this.socketIds.splice(
        this.socketIds.findIndex((item) => item === activeTab),
        1
      );
      sessionStorage.setItem("socketIds", JSON.stringify(this.socketIds));
      tabClose[activeTab].close();
      //console.log("tabClose22:",tabClose,tabClose[activeTab])
      // tabClose[activeTab].on("disconnect", (reason) => {
      //   //if (reason === "io server disconnect") {
      //   // the disconnection was initiated by the server, you need to reconnect manually
      //   //socket.connect();
      //   console.log("disconnect2222:", reason);
      //   //}
      //   // else the socket will automatically try to reconnect
      // });

      //同时将数组中这个对象删掉
      // this.sockets.forEach(item=>console.log("item.id:",item));
      // this.sockets.splice(
      //   this.sockets.findIndex((item) => item[activeTab] !== undefined),
      //   1
      // );
      // this.sockets.forEach(item=>console.log("item.id:",item));
    },
    handleclick(tab, event) {
      console.log("tab, event:", tab, event);
      //console.log(tab.name, event);
      sessionStorage.setItem("editableTabsValue", tab.name);
    },
  },

  created() {
    console.log("created");
    const socketIds = JSON.parse(sessionStorage.getItem("socketIds"));
    const sessions = JSON.parse(sessionStorage.getItem("editableTabs"));
    const editableTabsValue = sessionStorage.getItem("editableTabsValue");
    if (sessions) {
      //sessions.forEach((item) => console.log(item));
      let maxindex = parseInt(sessions[0].name);
      //console.log("maxindex:",parseInt(sessions[1].name))
      for (let i = 1; i < sessions.length; i++) {
        if (parseInt(sessions[i].name) > maxindex) {
          maxindex = parseInt(sessions[i].name);
        }
      }
      this.editableTabs = sessions;
      this.editableTabsValue = editableTabsValue;
      this.tabIndex = maxindex;
      this.socketIds = socketIds;
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
