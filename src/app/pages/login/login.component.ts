import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../../services/config';
import { getTokenValue } from '../../services/jwtDecode';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  showPassword: boolean = false;
  loginError: string = '';

  constructor(private http: HttpClient, private router: Router, private sessionService: SessionService) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    this.loginError = '';

    const payload = {
      email: this.email,
      password: this.password,
      stayLoggedIn: true
    };

    this.http.post<any>(`${BASE_URL}Account/Login`, payload).subscribe({
      next: (data) => {
        if (data?.jwtToken) {
          this.sessionService.setToken(data.jwtToken);
          this.sessionService.setHealthcareProviderId(getTokenValue(data.jwtToken,'HealthCareProviderId') || '');
          this.sessionService.sethcpMail(getTokenValue(data.jwtToken, 'email') || '');
          this.sessionService.setApplicationUserId(getTokenValue(data.jwtToken,'sub') || '');
          this.sessionService.setUsername(getTokenValue(data.jwtToken,'UserName') || '');
          this.router.navigateByUrl('/dashboard');
        } else {
          this.loginError = 'Username or password is incorrect';
        }
      },
      error: (err) => {
        console.error('Login error:', err);
        this.loginError = 'An error occurred during login. Please try again.';
      }
    });
  }
}
