const mongoose = require('mongoose');
const readLine = require ('readline');

//const dbURI = 'mongodb://localhost/ChatSite';
//mongoose.connect(dbURI, {useNewUrlParser: true});

const dbURI = process.env.MONGODB_URI;
try {
  mongoose.connect(
    dbURI,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log("connected!")
  );
} catch (error) {
  console.log(dbURI);
  console.log("could not connect!");
  process.exit();
}

mongoose.connection.on('connected', () => {
  console.log('Mongoose connected!');
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected!');
});

if (process.platform === 'win32') {
  const rl = readLine.createInterface ({
    input: process.stdin,
    output: process.stdout
  });
  rl.on ('SIGINT', () => {
    process.emit ("SIGINT");
  });
}

const gracefulShutdown = (msg, callback) => {
  mongoose.connection.close( () => {
    console.log(`Mongoose disconnected through ${msg}`);
    callback();
  });
};

process.on('SIGINT', () => {
  gracefulShutdown('app termination', () => {
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  gracefulShutdown('Heroku app shutdown', () => {
    process.exit(0);
  });
});

require('./chats');
