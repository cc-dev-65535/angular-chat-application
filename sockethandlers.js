const db = require('./db');

module.exports = (io) => {

  const messageHandler = function(msg) {
    const socket = this;
    const temp = socket.rooms.values();
    temp.next();
    const room = temp.next().value;
    db.sendMessage(io, socket, room, msg);
  };

  const leavePreviousRoom = function(socket) {
    for (let item of socket.rooms) {
      if (item != socket.id) {
        socket.leave(item);
      }
    }
  };

  const joinHandler = function(room) {
    const socket = this;
    //const temp = socket.rooms.values();
    /*
    for (let item of socket.rooms) {
      if (item != socket.id) {
        socket.leave(item);
      }
    }
    */
    leavePreviousRoom(socket);
    socket.join(room);
    db.getRoomMessages(io, socket, room);
  };

  const nameHandler = function(name) {
    const socket = this;
    db.setUsername(socket.id, name);
  };

  const disconnectHandler = function() {
    const socket = this;
    db.removeUsername(socket.id);
  };

  return {
    messageHandler,
    joinHandler,
    nameHandler,
    disconnectHandler
  };
}
