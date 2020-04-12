require("dotenv").config();
const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const { generateBoard } = require("./models");

let connected = [];
let interval;
let scores = [];
const weakMap = new WeakMap();

console.log("Time > ", process.env.TIME);

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/clear", (req, res) => {
  clearInterval(interval);
  res.send("Done");
});

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
    clearInterval(interval);
    let time = parseInt(process.env.TIME);
    io.emit("game started");
    io.emit("time", time);
    interval = setInterval(() => {
      time -= 1;
      io.emit("time", time);
      if (time === 0) {
        clearInterval(interval);
        io.emit("end game");
      }
    }, 1000);
  });

  socket.on("score", words => {
    console.log(words);
    const name = weakMap.get(socket);
    scores.push({ name, words });
    console.log(scores);
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
