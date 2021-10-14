const level = require('level');

const db = level('./app.db', {
  valueEncoding: 'json'
})

function setUsername(id, name) {
  let value = JSON.stringify({
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
    //console.log(`the room i'm saving to is ${room}`);
    if (err) throw err;
    let username = JSON.parse(result).name;
    msg = username + ': ' + msg;
    saveMessage(room, msg);
    io.to(room).emit('message', msg);
  });
}

/* Persist message in database */
function saveMessage(room, msg) {
  db.get(room, (err, result) => {
    //CASE: this socket is the first socket in the room
    if (err && err.notFound) {
      addMessage(room, msg, null);
      return;
    }
    if (err && !err.notFound) {
      throw err;
    }
    addMessage(room, msg, result);
  });
}

function addMessage(room, msg, history) {
  let value;

  if (history == null) {
    value = JSON.stringify({
      messages: [msg]
    });
    //console.log(value);
    db.put(room, value, err => {
      if (err) throw err;
    });
  } else {
    let msgArray = JSON.parse(history).messages;
    msgArray.push(msg);
    value = JSON.stringify({
      messages: msgArray
    });
    //console.log(value);
    db.put(room, value, err => {
      if (err) throw err;
    });
  }
}

/* Emit all saved room messages to client socket after a room join */
function getRoomMessages(io, socket, room) {
  db.get(socket.id, (err, result) => {
    if (err) throw err
    let username = JSON.parse(result).name;
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
    if (err && !err.notFound) {
      throw err;
    }
    let messages = JSON.parse(result).messages;
    //console.log(messages);
    //console.log("send to" + room);
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
