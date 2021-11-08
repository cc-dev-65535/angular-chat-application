const socket = io();
let currentRoom;

init();
addRoomLinks();

socket.on('message', (msg) => {
  const msgNode = document.createElement('div');
  msgNode.textContent = msg;
  let displayNode = document.querySelector('#chatDisplay');
  displayNode.appendChild(msgNode);
  displayNode.scrollTop = displayNode.scrollHeight;
});

document.querySelector('#chatInput').addEventListener("submit", (event) => {
  sendMessage();
  event.preventDefault();
});

document.querySelector("#inputBox").addEventListener("keydown", event => {
  if (event.key == "Enter") {
    sendMessage();
    event.preventDefault();
  }
});

document.querySelector('#nameInput').addEventListener("submit", (event) => {
  let inputBox = document.querySelector('#nameInputBox');
  if(inputBox.value != "") {
    socket.emit("set name", inputBox.value);
    setNameLabel(inputBox.value);
    inputBox.value = "";
  }
  event.preventDefault();
});

function addRoomLinks() {
  let list = document.querySelectorAll('#roomsList button');
  for (let item of list) {
    item.addEventListener("click", (event) => {
      let room = event.target;
      socket.emit("join room", room.textContent);

      let prevNode = document.querySelector(currentRoom);
      prevNode.setAttribute('class', '');
      currentRoom = "#" + item.id;
      //let node = document.querySelector(currentRoom);
      item.setAttribute('class', 'highlight');

      clearChatDisplay();
      event.preventDefault();
    });
  }
}

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

function init() {
  socket.emit('set name', `no_name`);
  setNameLabel("no_name")
  socket.emit('join room', "#random");

  currentRoom = "#roomFour";
  let node = document.querySelector(currentRoom);
  node.setAttribute('class', 'highlight');
}
