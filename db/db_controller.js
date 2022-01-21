const mongoose = require('mongoose');
const chatModel = mongoose.model('Chats');
const userModel = mongoose.model('Users');

async function checkInit(socket) {
  try {
    const userDoc = await userModel.findOne({socketId: socket.id});
    return (userDoc === null);
  } catch (error) {
    console.log(error);
  }
}

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
      const sendMsg = { room: room, text: `${userDoc.userName}: ${msg}` };
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
      const joinMsg = { room: room, text: `${userDoc.userName} joined ${room}` };
      const chatDoc = await chatModel.findOne({room: room}).session(session);
      const msgArray = chatDoc.messages;
      let sendMsg;
      for (let msg of msgArray) {
        sendMsg = { room: room, text: `${msg.author}: ${msg.text}` };
        io.to(socket.id).emit('message', sendMsg);
      }
      io.to(room).emit('message', joinMsg);
    });
    session.endSession();
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  checkInit,
  setUsername,
  removeUsername,
  sendMessage,
  getRoomMessages
}
