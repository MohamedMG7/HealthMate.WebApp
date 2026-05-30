import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse } from '../models/auth.models';
import { decodeJwt } from './jwt.util';
import { SessionService } from '../../services/session.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'hm_token';

  private _token = signal<string | null>(null);
  readonly isAuthenticated = computed(() => !!this._token());

  constructor(
    private http: HttpClient,
    private router: Router,
    private sessionService: SessionService
  ) {
    this.restoreSession();
  }

  login(credentials: LoginRequest): Observable<void> {
    return this.http
      .post<LoginResponse>(`${environment.apiBaseUrl}Account/Login`, credentials)
      .pipe(
        map(response => {
          if (!response?.jwtToken) throw new Error('No token in response');
          this.persistToken(response.jwtToken);
        })
      );
  }

  logout(): void {
    this._token.set(null);
    localStorage.removeItem(this.TOKEN_KEY);
    this.sessionService.clearSession();
    this.router.navigateByUrl('/login');
  }

  getToken(): string | null {
    return this._token();
  }

  private restoreSession(): void {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (token) {
      this.persistToken(token);
    }
  }

  private persistToken(token: string): void {
    this._token.set(token);
    localStorage.setItem(this.TOKEN_KEY, token);
    this.hydrateSession(token);
  }

  private hydrateSession(token: string): void {
    const claims = decodeJwt(token);
    if (!claims) return;
    this.sessionService.setToken(token);
    this.sessionService.setHealthcareProviderId(claims.HealthCareProviderId ?? '');
    this.sessionService.sethcpMail(claims.email ?? '');
    this.sessionService.setApplicationUserId(claims.sub ?? '');
    this.sessionService.setUsername(claims.UserName ?? '');
    if (claims.specialization) {
      this.sessionService.setSpecialization(claims.specialization);
    }
  }
}
