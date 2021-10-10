const db = require('./db');

module.exports = (io) => {

  const messageHandler = function(msg) {
    const socket = this;
    let temp = socket.rooms.values();
    temp.next();
    let room = temp.next().value;
    db.sendMessage(io, socket, room, msg);
  }

  const joinHandler = function(room) {
    const socket = this;
    socket.join(room);
    console.log(`${socket.id} joined ${room}`);
    db.getRoomMessages(io, socket, room);
  }

  const nameHandler = function(name) {
    const socket = this;
    db.setUsername(socket.id, name);
    console.log(`${socket.id} set username to ${name}`);
  }

  const disconnectHandler = function() {
    const socket = this;
  }

  return  {
    messageHandler,
    joinHandler,
    nameHandler,
    disconnectHandler
  }
}
