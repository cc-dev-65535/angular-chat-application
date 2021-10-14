const db = require('./db');

module.exports = (io) => {

  const messageHandler = function(msg) {
    const socket = this;
    const temp = socket.rooms.values();
    //console.log(socket.rooms);
    temp.next();
    const room = temp.next().value;
    //console.log(room + '!!');
    db.sendMessage(io, socket, room, msg);
  }

  const joinHandler = function(room) {
    const socket = this;
    //const temp = socket.rooms.values();
    for (let item of socket.rooms) {
      if (item != socket.id) {
        socket.leave(item);
      }
    }
    socket.join(room);
    console.log(socket.rooms);
    console.log(room + "left");
    //console.log(`${socket.id} joined ${room}`);
    db.getRoomMessages(io, socket, room);
  }

  const nameHandler = function(name) {
    const socket = this;
    db.setUsername(socket.id, name);
  }

  const disconnectHandler = function() {
    const socket = this;
    db.removeUsername(socket.id);
  }

  return {
    messageHandler,
    joinHandler,
    nameHandler,
    disconnectHandler
  }
}
