import { Component, OnInit, Input } from '@angular/core';
import { SocketService } from '../socket.service';

export class Message {
  _id: string = "";
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  messages: Message[] = [{_id:""},{_id:""}];

  constructor(private socketService: SocketService) { }

  ngOnInit(): void {
    console.log("here");
    console.log(this.socketService.socket);
    this.socketService.setUsername("aa");
    this.socketService.joinRoom("#random");
  }

}
