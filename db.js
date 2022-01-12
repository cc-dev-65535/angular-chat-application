const level = require('level');

const db = level('./app.db', {
  valueEncoding: 'json'
});

function setUsername(id, name) {
  const value = JSON.stringify({
    name: name
  });

  db.put(id, value, err => {
    if (err) throw err;
    console.log(`${id} set username to ${name}`);
  });
}

function removeUsername(id) {
  db.del(id, err => {
    if (err) throw err;
    console.log(`removed ${id}'s key from the database`);
  });
}

/* Find socket username from databse and send message to all other sockets in specified room*/
function sendMessage(io, socket, room, msg) {
  db.get(socket.id, (err, result) => {
    // CASE: client socket id not in database yet
    if (err && err.notFound) {
      console.log("probably concurrency error");
      return;
    }
    // CASE: normal error
    if (err && !err.notFound) {
      throw err;
    }

    const username = JSON.parse(result).name;
    const sendMsg = username + ': ' + msg;
    saveMessage(io, room, sendMsg);
  });
}

/* Persist message in database */
function saveMessage(io, room, msg) {
  db.get(room, (err, result) => {
    // CASE: this socket is the first socket in the room
    if (err && err.notFound) {
      value = JSON.stringify({
        messages: [msg]
      });
      db.put(room, value, err => {
        if (err) throw err;
        io.to(room).emit('message', msg);
      });
      return;
    }
    // CASE: normal error
    if (err && !err.notFound) {
      throw err;
    }

    let msgArray = JSON.parse(result).messages;
    msgArray.push(msg);
    value = JSON.stringify({
      messages: msgArray
    });
    db.put(room, value, err => {
      if (err) throw err;
      io.to(room).emit('message', msg);
    });
  });
}

/* Emit all saved room messages to client socket after a room join */
function getRoomMessages(io, socket, room) {
  db.get(socket.id, (err, result) => {
    // CASE: client socket id not in database yet
    if (err && err.notFound) {
      console.log("probably concurrency error");
      return;
    }
    // CASE: normal error
    if (err && !err.notFound) {
      throw err;
    }

    const username = JSON.parse(result).name;
    const joinMsg = `${username} joined ${room}`;
    sendRoomMessages(io, socket, room, joinMsg);
  });
}

function sendRoomMessages(io, socket, room, joinmsg) {
  db.get(room, (err, result) => {
    // CASE: this socket is the first socket in the room
    if (err && err.notFound) {
      io.to(room).emit('message', joinmsg);
      return;
    }
    // CASE: normal error
    if (err && !err.notFound) {
      throw err;
    }

    const messages = JSON.parse(result).messages;
    for (let msg of messages) {
        io.to(socket.id).emit('message', msg);
    }
    io.to(room).emit('message', joinmsg);
  });
}

module.exports = {
  setUsername,
  removeUsername,
  sendMessage,
  getRoomMessages
}
