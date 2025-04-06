//app.component.ts
import {Component, OnInit} from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {ChatMessage} from './dto/chat-message';
import {FormsModule} from '@angular/forms';
import {ChatServiceService} from './services/chat-service.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { ChangeDetectorRef } from '@angular/core';
import {JsonPipe, NgForOf} from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [MatIconModule, MatToolbarModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatListModule, FormsModule, NgForOf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'sse-demo';
  messageForm= new ChatMessage();
  sending = false;
  constructor(private chatService: ChatServiceService, private snackBar: MatSnackBar, private cdr: ChangeDetectorRef) {}

  sendMessage() {
    this.sending = true;
    if (this.messageForm.nickname && this.messageForm.message) {
      this.chatService.sendMessage(this.messageForm).subscribe({next: value => {
        this.snackBar.open('Messaggio inviato correttamente', 'Chiudi', {duration: 2000});
        this.sending = false;
        },
      error: err => {
        this.snackBar.open('Errore durante l\'invio del messaggio', 'Chiudi', {duration: 2000, verticalPosition: "top"});
        this.sending = false;
      }
      });
      this.messageForm.message = '' // Reset form after sending
    }else {
      this.snackBar.open('Compilare tutti i campi della form', 'Chiudi', {duration: 2000, verticalPosition: "top"});
      this.sending = false;
    }
  }

  //gestione messaggi in app.component.ts
  messages: ChatMessage[] = [];

  ngOnInit(): void {
    this.chatService.getMessages().subscribe({
      next: (message) => {
        this.messages.push(message);
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Stream error:', err)
    });
  }

}
