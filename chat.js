const User = require("./models/User");
module.exports = (httpServer) => {
  const io = require("socket.io")(httpServer);
  io.on("connection", (socket) => {
    socket.on("newMessage", (data) => {
      let avatar = new User({ email: data[0].email }).getAvatar();
      data[0] = { sender: data[0].sender, text: data[0].text, avatar };
      io.emit("incomingMsg", data);
    });
  });
};
