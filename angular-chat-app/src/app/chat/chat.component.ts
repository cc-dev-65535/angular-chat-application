import { Component, OnInit, AfterViewInit, Input, ViewChild, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { SocketService } from '../socket.service';
// @ts-ignore
import insertTextAtCursor from '../../../../node_modules/insert-text-at-cursor/index';
import '../../../../node_modules/emoji-picker-element/index';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewInit {

  @ViewChild('cd') display: ElementRef | null = null;
  @ViewChild('ib') input: ElementRef | null = null;

  public visible = "hidden";
  public textBox = new FormControl("");
  public inputBox = new FormControl("");
  public nameLabel: string = "Current Handle Name: unnamed";

  constructor(private socketService: SocketService, private router: Router) { }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    this.socketService.display = this.display;
    const room = this.getRoom();
    //console.log("joined " + room);
    this.socketService.joinRoom(room);
    this.setLabel();
  }

  private getRoom() {
    return "#" + this.router.url.split('/')[2];
  }

  public onSubmit() {
    const msg = this.textBox.value;
    this.textBox.reset("");
    this.socketService.sendMessage(msg);
  }

  public onEnterSubmit(event: any) {
    if (event.key === "Enter") {
      this.onSubmit();
      event.preventDefault();
    }
  }

  public onNameChange() {
    const name = this.inputBox.value;
    this.inputBox.reset("");
    this.socketService.setUsername(name);
    this.setLabel();
  }

  public onIconClick() {
    if (this.visible === "hidden") {
      this.visible = "";
    } else {
      this.visible = "hidden";
    }
  }

  public onEmoji(event: any) {
    if (this.input === null) {
      return;
    }
    insertTextAtCursor(this.input.nativeElement, event.detail.unicode);
  }

  private setLabel() {
    this.nameLabel = `Current Handle Name: ${this.socketService.username}`
  }
}
