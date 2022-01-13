const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  author: { type: String, required: true },
  timestamp: { type: Date, 'default': Date.now },
  text: { type: String }
});

const chatSchema = new mongoose.Schema({
  room: { type: String, required: true },
  timestamp: { type: Date, 'default': Date.now },
  messages: [messageSchema]
});

const userSchema = new mongoose.Schema({
  socketId: { type: String, required: true },
  userName: { type: String, required: true }
});

mongoose.model('Chats', chatSchema);
mongoose.model('Users', userSchema);
