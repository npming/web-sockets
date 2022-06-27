const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const moment = require('moment');

let userName;
let roomId = [];
let users = []

app.use(express.urlencoded({extended: false}))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/pages/login.html');
});

app.post('/home', (req, res) => {
  res.sendFile(__dirname + '/pages/home.html' );
  userName = req.body.name;
});

app.get('/admin', (req, res) => {
  res.sendFile(__dirname + '/pages/admin.html' );
});

io.on('connection', (socket) => {
  console.log('a user connected');
  
  socket.on("user_info", async (data) => {
    socket.join("rid_"+userName); // creating a room id
    users.push({"name": userName , "id": socket.id, "room": "rid_"+userName})
  });

  socket.on('client_message', (msg) => {
    // to send back to client
    socket.emit("server_message", msg);
    // to send to admin
    socket.broadcast.emit("server_message", msg);
  });

  // when disconnected
  socket.on('disconnect', (data) => {
    console.log('user disconnected');
  });

});

server.listen(3000, () => {
  console.log('listening on 3000');
});
