import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MessageSummary, MessageDetail, Receiver } from '../models/message.models';

@Injectable({ providedIn: 'root' })
export class MessageService {
  constructor(private http: HttpClient) {}

  getInbox(): Observable<MessageSummary[]> {
    return this.http.get<MessageSummary[]>(`${environment.apiBaseUrl}Message/inbox`);
  }

  getMessage(id: number | string): Observable<MessageDetail> {
    return this.http.get<MessageDetail>(`${environment.apiBaseUrl}Message/${id}`);
  }

  markRead(id: number | string): Observable<void> {
    return this.http.post<void>(`${environment.apiBaseUrl}Message/${id}/read`, {});
  }

  getReceivers(): Observable<Receiver[]> {
    return this.http.get<Receiver[]>(`${environment.apiBaseUrl}Message/available-receivers`);
  }

  send(payload: { receiverId: string; subject: string; body: string }): Observable<void> {
    return this.http.post<void>(`${environment.apiBaseUrl}Message`, payload);
  }
}
