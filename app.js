require("dotenv").config();
const cors = require("cors");
const express = require("express");
const app = express();
app.use(cors());
const http = require("http");
const server = http.createServer(app);
const events = require("events");
const myevent = new events.EventEmitter();
const { Server } = require("socket.io");

const io = new Server(server);

io.on("connection", (socket) => {
  console.log("I am inside conn");

  socket.on("hello", () => {
    console.log("Hey");
  });
});
myevent.on("Hello", (data) => {
  console.log(data);
});
app.use((req, res, next) => {
  req.myevent = myevent;
  next();
});
require("./config/mongoose.config");

const routes = require("./routes/");

app.use("/assets", express.static("public/"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(routes);

app.use((req, res, next) => {
  next({
    status: 404,
    msg: "not found",
  });
});

app.use((error, req, res, next) => {
  let status = error.status ?? 500;
  let msg = error.msg ?? error;
  res.status(status).json({
    result: null,
    status: false,
    msg: msg,
  });
});

server.listen(3000, "localhost", (err) => {
  if (!err) {
    console.log("Server is listening to port: 3000");
    console.log("Press CTRL+C to disconnect server");
  }
});
