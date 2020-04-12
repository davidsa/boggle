const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const { generateBoard } = require("./models");

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

let connected = [];
const weakMap = new WeakMap();

io.on("connection", socket => {
  console.log("someone connected");

  socket.emit("connected people", connected);

  socket.on("enter", name => {
    console.log(name);
    weakMap.set(socket, name);
    connected.push(name);
    socket.broadcast.emit("connected people", connected);
  });

  socket.on("prepare game", () => {
    const board = generateBoard();
    io.emit("prepare game", board);
  });

  socket.on("generate board", () => {
    const board = generateBoard();
    io.emit("board generated", board);
  });

  socket.on("start game", () => {
    let time = 60 * 3;
    io.emit("game started");
    io.emit("time", time);
    const interval = setInterval(() => {
      time -= 1;
      io.emit("time", time);
      if (time === 0) {
        clearInterval(interval);
        io.emit("end game");
      }
    }, 1000);
  });

  socket.on("disconnect", () => {
    const name = weakMap.get(socket);
    connected = connected.filter(person => person !== name);
    io.emit("connected people", connected);
    console.log("disconnected", name);
  });
});

http.listen(3000, function () {
  console.log("listening on *:3000");
});
