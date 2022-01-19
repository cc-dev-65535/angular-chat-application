import { Injectable } from '@angular/core';
// @ts-ignore
import * as io from '../assets/socket.io';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  socket: any;
  room: string = "";

  constructor() {
    this.socket = io();
    this.socket.on('message', this.messageHandler);
    console.log(this.socket);
  }

  public sendMessage(msg: string): void {
    this.socket.emit('message', msg);
  }

  public joinRoom(room : string): void {
    this.room = room;
    this.socket.emit('join room', room);
  }

  public setUsername(name : string): void {
    this.socket.emit('set name', name);
  }

  private messageHandler(msg: any): void {
    const room : string = msg.room;
    const text : string = msg.text;
    if (room !== this.room) {
      return;
    }
    const msgNode = document.createElement('div');
    msgNode.textContent = text;
    let displayNode = document.querySelector('#chatDisplay');
    displayNode.appendChild(msgNode);
    displayNode.scrollTop = displayNode.scrollHeight;
  }
}
