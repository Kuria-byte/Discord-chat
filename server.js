const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const formatMessage = require("./utils/message");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const bot = "Chat Bot";

app.use(express.static(path.join(__dirname, "public")));

// It runs when a client connects
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);

    // Welcome User
    socket.emit(
      "message",
      formatMessage(bot, "Welcome to our Discord chat room")
    );
    // Broadcat user joined room
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(bot, `${user.username} has joined the chat`)
      );

    // Send users and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // Listen for chatMessage
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });

// Runs when client disconnects
socket.on('disconnect', () => {
  const user = userLeave(socket.id);

  if (user) {
    io.to(user.room).emit(
      'message',
      formatMessage(bot, `${user.username} has left the chat`)
    );

    // Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  }
});
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Serer has started on ${PORT}`));
