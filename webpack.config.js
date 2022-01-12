let path = require("path");

module.exports = {
  entry: "./public/javascripts/chatscript.js",
  mode: 'production',
  output: {
    path: path.resolve(__dirname,'public/javascripts'),
    filename: 'bundle.js'
  },
  module: {
    
  }
};
