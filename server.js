const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const formatMessage = require ('./utils/message')

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const bot = 'ChatBot';

app.use(express.static(path.join(__dirname, "public")));

// It runs when a client connects
io.on("connection", (socket) => {
socket.on('joinRoom',({username,room})=>{
// Welcome User
    socket.emit("message", formatMessage(bot,"Welcome to our Discord chat room") );
// Broadcat user joined room
    socket.broadcast.emit("message", formatMessage(bot,"user has joined the chat"));

})

  // Listen for chat messages
  socket.on("chatMessage", (msg) => {
    io.emit("message", msg);
  });

  socket.on("disconnect", () => {
    io.emit("message", formatMessage('USER',"a user has left the chat room"));
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Serer has started on ${PORT}`));
