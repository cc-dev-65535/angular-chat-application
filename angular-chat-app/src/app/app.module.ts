import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { ChatComponent } from './chat/chat.component';
import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from './home/home.component';
import { SocketService } from './socket.service';

@NgModule({
  declarations: [
    ChatComponent,
    LayoutComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
        {
          path: '',
          component: HomeComponent
        },
        {
          path: 'room/animals',
          component: ChatComponent
        },
        {
          path: 'room/funny',
          component: ChatComponent
        },
        {
          path: 'room/food',
          component: ChatComponent
        },
        {
          path: 'room/random',
          component: ChatComponent
        }
    ]),
    ReactiveFormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [],
  bootstrap: [LayoutComponent]
})
export class AppModule { }
