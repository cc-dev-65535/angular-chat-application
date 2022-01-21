import { Injectable, ElementRef } from '@angular/core';
// @ts-ignore
import * as io from '../assets/socket.io';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  public display: ElementRef | null = null;
  public socket: any;
  public room = "";
  public username = "unnamed";
  public messageHandler = (msg: any) => {
    const room: string = msg.room;
    const text: string = msg.text;
    if (room !== this.room) {
      return;
    }
    const msgNode: any = document.createElement('div');
    if (this.display === null) {
      return;
    }
    msgNode.textContent = text;
    this.display.nativeElement.appendChild(msgNode);
    this.display.nativeElement.scrollTop = this.display.nativeElement.scrollHeight;
  }

  constructor() {
    this.socket = io();
    this.socket.on('message', this.messageHandler);
  }

  public sendMessage(msg: string): void {
    this.socket.emit('message', msg);
  }

  public joinRoom(room : string): void {
    this.room = room;
    this.socket.emit('join room', room);
  }

  public setUsername(name : string): void {
    this.username = name;
    this.socket.emit('set name', name);
  }
}
