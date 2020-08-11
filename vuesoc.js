//测试在vue项目中使用vue-socket.io，
var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);

app.get("/", function(req, res) {
  res.send("<h1>你好web秀</h1>");
});

let sockets = [];
let roomflg = {};

io.on("connection", function(socket) {
  
  sockets.push(socket);

  console.log(
    `我是服务端，现在已经和${sockets.length}个客户端建立连接了,依次打出他们的socket.id：`
  );
  sockets.forEach((item) => {
    console.log(item.id);
  });

  socket.join("237room", () => {
    let rooms = Object.keys(socket.rooms);
    console.log("首次加入房间：", rooms); // [ <socket.id>, 'room 237' ]
    io.to("237room").emit("a new user has joined the room", {
      message: "a new user has joined the room 237",
    }); //' broadcast to everyone in the room

    setInterval(()=>{socket.emit("interval")},3000);

  });

  socket.on("enterRoom", function(obj) {

    console.log("接收到客户端的enterRoom:", obj.roomNum, socket.id);

    socket.join(obj.roomNum, () => {
      let rooms = Object.keys(socket.rooms);
      console.log("rooms[2]:",rooms[2]);
      console.log("加入特定房间：", rooms); // [ <socket.id>, 'room 237' ]
      //在这个地方删除之前建立的连接
      if (roomflg[rooms[2]] === 1) {
        console.log("sockets.length:", sockets.length);
        sockets.forEach((item) => console.log("enterRoom:", item.id,item.rooms));
        console.log(sockets.findIndex((item) => item.rooms[2] === rooms[2]));
        // sockets.splice(
        //   sockets.findIndex((item) => item.rooms[2] === rooms[2]),
        //   1
        // );
        // console.log("sockets.length:", sockets.length);
        sockets.forEach((item) => console.log("enterRoom:", item.id));
      } else {
        roomflg[rooms[2]] = 1;
      }

      //
      io.to(obj.roomNum).emit(obj.roomNum, {
        message: `only one room + ${obj.roomNum}`,
      });
    });
  });

  socket.on("disconnect", (reason) => {
    //if (reason === "io server disconnect") {
    // the disconnection was initiated by the server, you need to reconnect manually
    //socket.connect();
    console.log("disconnect1:");
    sockets.forEach((item) => {
      console.log(item.id, item.connected);
    });
    sockets = sockets.filter((item) => item.connected === true);
    console.log("disconnect2:", sockets.length, sockets);
    sockets.forEach((item) => {
      console.log(item.id, item.connected);
    });
    console.log("disconnect3333:", reason);

    //}
    // else the socket will automatically try to reconnect
  });
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
