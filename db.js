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
  });
}

function addMessage(room, msg, history) {
  let value;

  if (history == null) {
    value = JSON.stringify({
      messages: [msg]
    });
    db.put(room, value, err => {
      if (err) throw err;
    });
  } else {
    let msgArray = JSON.parse(history).messages;
    msgArray.push(msg);
    value = JSON.stringify({
      messages: msgArray
    });
    console.log(value);
    db.put(room, value, err => {
      if (err) throw err;
    });
  }
}

function saveMessage(room, msg) {
  db.get(room, (err, result) => {
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

function sendMessage(io, socket, room, msg) {
  db.get(socket.id, (err, result) => {
    if (err) throw err;
    let username = JSON.parse(result).name;
    msg = username + ': ' + msg;
    saveMessage(room, msg);
    io.to(room).emit('message', msg);
  });
}

function getRoomMessages(io, socket, room) {
  db.get(room, (err, result) => {
    let joinmsg = (`${socket.id} joined ${room}`);
    if (err && err.notFound) {
      io.to(room).emit('message', joinmsg);
      return;
    }
    if (err && !err.notFound) {
      throw err;
    }
    let messages = JSON.parse(result).messages;
    console.log(messages);
    for (let msg of messages) {
        io.to(socket.id).emit('message', msg);
    }
    io.to(room).emit('message', joinmsg);
  });
}

module.exports = {
  setUsername,
  sendMessage,
  getRoomMessages
}
