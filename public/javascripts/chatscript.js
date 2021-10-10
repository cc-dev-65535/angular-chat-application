let socket = io();

socket.on('message', (msg) => {
  let msgNode = document.createElement('p');
  msgNode.textContent = msg;
  document.querySelector('#chatDisplay').appendChild(msgNode);
});

/*
socket.on('roomupdate', (msg) => {
  let msgNode = document.createElement('p');
  msgNode.textContent = msg;
  document.querySelector('#chatDisplay').appendChild(msgNode);
});
*/

document.querySelector('#chatInput').addEventListener("submit", (event) => {
  let inputBox = document.querySelector('#inputBox');
  if(inputBox.value != null) {
    socket.emit("message", inputBox.value);
    inputBox.value = "";
  }
  event.preventDefault();
});

document.querySelector('#nameInput').addEventListener("submit", (event) => {
  let inputBox = document.querySelector('#nameInputBox');
  if(inputBox.value != null) {
    socket.emit("set name", inputBox.value);
    inputBox.value = "";
  }
  event.preventDefault();
});

let list = document.querySelectorAll('#rooms .list-group-item');
for (let item of list) {
  item.addEventListener("click", (event) => {
      let room = event.target;
      socket.emit("join room", room.textContent);
      clearChatDisplay();
      event.preventDefault();
  });
}

function clearChatDisplay() {
  let childNodes = document.querySelector('#chatDisplay').children;

  for (let i = childNodes.length; i > 0; i--) {
    childNodes[i-1].remove();
  }
}
