const mongoose = require('mongoose');
const chatModel = mongoose.model('Chats');
const userModel = mongoose.model('Users');

/* Username-realted functions */
async function setUsername(id, name) {
  try {
    const session = await mongoose.connection.startSession();
    await session.withTransaction(async () => {
      const userDoc = await userModel.findOne({socketId: id}).session(session);
      if (userDoc === null) {
        return await userModel.create([{ socketId: id, userName: name }], { session: session });
      }
      userDoc.userName = name;
      await userDoc.save();
    });
    session.endSession();
  } catch (error) {
    console.log(error);
  }
}

async function removeUsername(id) {
  try {
    await userModel.deleteOne({socketId: id}).exec();
  } catch (error) {
    console.log(error);
  }
}

/* Find socket username from databse and send message to all other sockets in specified room*/
async function sendMessage(io, socket, room, msg) {
  try {
    const session = await mongoose.connection.startSession();
    await session.withTransaction(async () => {
      const userDoc = await userModel.findOne({socketId: socket.id}).select('userName').session(session);
      const sendMsg = `${userDoc.userName}: ${msg}`;
      const chatDoc = await chatModel.findOne({room: room}).session(session);
      const messageObj = {
        author: userDoc.userName,
        text: msg
      }
      chatDoc.messages.push(messageObj);
      await chatDoc.save();
      io.to(room).emit('message', sendMsg);
    });
    session.endSession();
  } catch (error) {
    console.log(error);
  }
}

/* Emit all saved room messages to client socket after a room join */
async function getRoomMessages(io, socket, room) {
  try {
    const session = await mongoose.connection.startSession();
    await session.withTransaction(async () => {
      const userDoc = await userModel.findOne({socketId: socket.id}).select('userName').session(session);
      if (userDoc === null) {
        return;
      }
      const joinMsg = `${userDoc.userName} joined ${room}`;
      const chatDoc = await chatModel.findOne({room: room}).session(session);
      const msgArray = chatDoc.messages;
      for (let msg of msgArray) {
        io.to(socket.id).emit('message', `${msg.author}: ${msg.text}`);
      }
      io.to(room).emit('message', joinMsg);
    });
    session.endSession();
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  setUsername,
  removeUsername,
  sendMessage,
  getRoomMessages
}
