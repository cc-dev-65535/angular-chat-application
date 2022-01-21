const db = require('./db/db_controller');

module.exports = (io) => {

  const dbInit = async function() {
    const socket = this;
    await nameHandler.bind(socket, "unnamed")();
    //await joinHandler.bind(socket, "")();
  };

  const notInit = function() {
    const socket = this;
    return db.checkInit(socket);
  }

  const getRoom = function(socket) {
    const temp = socket.rooms.values();
    temp.next();
    return temp.next().value;
  }

  const messageHandler = function(msg) {
    const socket = this;
    const room = getRoom(socket);
    db.sendMessage(io, socket, room, msg);
  };

  const leavePreviousRoom = function(socket) {
    for (let item of socket.rooms) {
      if (item !== socket.id) {
        socket.leave(item);
      }
    }
  };

  const joinHandler = async function(room) {
    const socket = this;
    const init = await notInit.bind(socket)();
    if (init) {
      await dbInit.bind(socket)();
    }
    const prevRoom = getRoom(socket);
    leavePreviousRoom(socket);
    socket.join(room);
    if (!(/#random|#funny|#animals|#food/.test(room)) || prevRoom === room) {
      return;
    }
    return db.getRoomMessages(io, socket, room);
  };

  const nameHandler = function(name) {
    const socket = this;
    if (name === "") {
      return;
    }
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
