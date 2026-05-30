import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface SinaSessionResponse {
  sessionId: string;
  alerts: { message: string }[];
}

export interface SinaMessageResponse {
  reply: string;
}

@Injectable({ providedIn: 'root' })
export class SinaService {
  constructor(private http: HttpClient) {}

  openSession(patientId: string): Observable<SinaSessionResponse> {
    return this.http.post<SinaSessionResponse>(
      `${environment.apiBaseUrl}Sina/sessions`,
      { patientId }
    );
  }

  sendMessage(sessionId: string, content: string): Observable<SinaMessageResponse> {
    return this.http.post<SinaMessageResponse>(
      `${environment.apiBaseUrl}Sina/sessions/${sessionId}/messages`,
      { content }
    );
  }
}
