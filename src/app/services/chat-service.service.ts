//services/chat-service.service.ts
import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ChatMessage} from '../dto/chat-message';

@Injectable({
  providedIn: 'root'
})
export class ChatServiceService {
  constructor(private http: HttpClient) { }

  getMessages= (): Observable<ChatMessage> => {
    return new Observable(observer => {
      const eventSource = new EventSource("/api/messages");
      eventSource.onmessage = (event) => {
        let eventData = JSON.parse(event.data) as ChatMessage;
        observer.next(eventData);
      };

      eventSource.onerror = (error) => {
        eventSource.close();
        observer.error(error);
      };
      return () => eventSource.close();
    });

  }

  sendMessage(message: ChatMessage): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post('/api/message', message, { headers });
  }
}
