//测试在vue项目中使用vue-socket.io，
var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);

app.get("/", function(req, res) {
  res.send("<h1>你好web秀</h1>");
});

let tabs = [];
let message = [];
let sendmesg = "";

io.on("connection", function(socket) {
  console.log(
    `我是服务端，现在已经和客户端建立连接了,打出他的socket.id：`,
    socket.id
  );

  socket.on("enterRoom", (obj) => {
    tabs.push(obj.roomNum);
    console.log("enterRoom》tabs:", tabs);
    message = [];
    for (let i = 0; i < tabs.length; i++) {
      let message1 = { name: tabs[i] };
      message.push(message1);
    }
    sendmesg = JSON.stringify(message);
    console.log("enterRoom》sendmesg:", sendmesg);
  });

  socket.on("leaveRoom", (obj) => {
    console.log("关闭掉了其中的一个tab:", obj.roomNum);
    tabs.splice(
      tabs.findIndex((item) => item === obj.roomNum),
      1
    );
    console.log("leaveRoom》tabs:", tabs);
    message = [];
    if (tabs.length === 0) {
      socket.disconnect();//当关闭最后一个tab的时候，关掉
    } else {
      for (let i = 0; i < tabs.length; i++) {
        let message1 = { name: tabs[i] };
        message.push(message1);
      }
      sendmesg = JSON.stringify(message);
      console.log("leaveRoom》sendmesg:", sendmesg);
    }
  });

  setInterval(() => {
    socket.emit("clientmessage", { sendmesg: sendmesg });
  }, 4000);

  socket.on("disconnect", (reason) => {
    console.log("disconnect3333:", reason);
    console.log("disconnect3333:", tabs);
    tabs = [];
    message = [];
    sendmesg = "";
  });

  // socket.on("disc", (reason) => {
  //   console.log("disconnect4444:", reason);
  //   console.log("disconnect4444:", tabs);
  //   tabs = [];
  //   message = [];
  //   sendmesg = "";
  //   socket.disconnect();
  // });
});

http.listen(3000, function() {
  console.log("listening on *:3000");
});

// 作者：javanx
// 链接：https://juejin.im/post/6844903935656853512
// 来源：掘金
// 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
//一个socket对应一个room
//1》可以建立一个socket连接，每新增一个tab的时候emit一个事件
//   当关闭掉一个tab的时候，
//2》也可以一个tab建立一个连接，
//   但是这样当关闭掉其中一个tab的时候，关闭掉对应的连接
//   由于没有办法传递给后端服务器，因此在后端需要循环，
//   当connected为false的时候，去掉这个socket连接
//   2.1在关闭连接的时候，在关闭事件里：前端在close之前emit一个事件不行
//   2.2在新建连接的时候，事先前端emit一个closeee事件，尝试在后端disconnect的时候，去on事件closeee，发现不行
//3》namespace命名空间
