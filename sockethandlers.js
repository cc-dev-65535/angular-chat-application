const db = require('./db/db_controller');

module.exports = (io) => {

  const dbInit = async function() {
    const socket = this;
    await nameHandler.bind(socket, "unnamed")();
    await joinHandler.bind(socket, "#random")();
  };

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
    leavePreviousRoom(socket);
    socket.join(room);
    return db.getRoomMessages(io, socket, room);
  };

  const nameHandler = function(name) {
    const socket = this;
    return db.setUsername(socket.id, name);
  };

  const disconnectHandler = function() {
    const socket = this;
    db.removeUsername(socket.id);
  };

  return {
    dbInit,
    messageHandler,
    joinHandler,
    nameHandler,
    disconnectHandler
  };
}
