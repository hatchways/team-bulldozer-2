const socket = require("socket.io");

module.exports = (server) => {
  const io = socket(server);
  const users = {};

  io.on("connection", (socket) => {
    if (!users[socket.id]) {
      users[socket.id] = socket.id;
    }

    io.sockets.emit("allUsers", users);

    socket.on("disconnect", () => {
      delete users[socket.id];
    });
  });
};
