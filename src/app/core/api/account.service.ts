import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AccountService {
  constructor(private http: HttpClient) {}

  resetPassword(payload: {
    ApplicationUserId: string;
    currentPassword: string;
    newPassword: string;
  }): Observable<void> {
    return this.http.post<void>(
      `${environment.apiBaseUrl}Account/resetpassword`,
      payload
    );
  }
}
