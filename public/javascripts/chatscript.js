const io = require('../socket.io/socket.io');
const insertTextAtCursor = (...args) => import('insert-text-at-cursor').then(({default: insertTextAtCursor}) => insertTextAtCursor(...args));
/*let insertTextAtCursor;
(async () => {
    insertTextAtCursor = await import('insert-text-at-cursor');
})();*/
const socket = io();
let currentRoom;
const roomsEnum = {"#roomOne": "#animals",
                    "#roomTwo": "#funny",
                    "#roomThree": "#food",
                    "#roomFour": "#random"};

// WebSocket message handler
socket.on('message', (msg) => {
  const msgNode = document.createElement('div');
  msgNode.textContent = msg;
  let displayNode = document.querySelector('#chatDisplay');
  displayNode.appendChild(msgNode);
  displayNode.scrollTop = displayNode.scrollHeight;
});

// Initialization
init();

/* Setup emoji picker */
document.querySelector('#emojiIcon').addEventListener("click", (event) => {
  const emojiPickerNode = document.querySelector('#emojiPicker');
  if (emojiPickerNode.getAttribute("class") == "hidden") {
    emojiPickerNode.setAttribute("class", "");
  } else {
    emojiPickerNode.setAttribute("class", "hidden");
  }
  return false;
});

/*
window.addEventListener("click", (event) => {
  const emojiPickerNode = document.querySelector('#emojiPicker');
  emojiPickerNode.setAttribute("class", "hidden");
});
*/

document.querySelector('#emojiPicker').addEventListener('emoji-click', event => {
    insertTextAtCursor(document.querySelector('#inputBox'), event.detail.unicode);
});

/* Message submission listeners */
document.querySelector('#chatInput').addEventListener("submit", (event) => {
  sendMessage();
  event.preventDefault();
});

document.querySelector("#inputBox").addEventListener("keydown", (event) => {
  if (event.key == "Enter") {
    sendMessage();
    event.preventDefault();
  }
});

// Handler for setting handle name
document.querySelector('#nameInput').addEventListener("submit", (event) => {
  let inputBox = document.querySelector('#nameInputBox');
  if(inputBox.value != "") {
    socket.emit("set name", inputBox.value);
    setNameLabel(inputBox.value);
    inputBox.value = "";
  }
  event.preventDefault();
});

// Message submission handler
function sendMessage() {
  const inputBox = document.querySelector('#inputBox');
  socket.emit("message", inputBox.value);
  inputBox.value = "";
}

function clearChatDisplay() {
  let childNodes = document.querySelector('#chatDisplay').children;
  for (let i = childNodes.length; i > 0; i--) {
    childNodes[i-1].remove();
  }
}

function setNameLabel(name) {
  document.querySelector('#nameLabel').textContent = `Current Handle Name: ${name}`;
}

// Set initial handle name and room and add room links
function init() {
  socket.emit('init');
  //socket.emit('set name', 'unnamed');
  setNameLabel("unnamed");

  //socket.emit('join room', "#random");
  currentRoom = "#roomFour";
  const node = document.querySelector(currentRoom);
  node.setAttribute('class', 'highlight');
  addRoomLinks();
}

function addRoomLinks() {
  let list = document.querySelectorAll('#roomsList button');
  for (let item of list) {
    item.addEventListener("click", (event) => {
      clearChatDisplay();
      let room = event.target;
      socket.emit("join room", room.textContent);

      let prevNode = document.querySelector(currentRoom);
      prevNode.setAttribute('class', '');
      currentRoom = "#" + item.id;
      item.setAttribute('class', 'highlight');

      event.preventDefault();
      return false;
    });
  }
}
