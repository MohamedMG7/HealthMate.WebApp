import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';
import { LoginRequest } from '../../core/models/auth.models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  showPassword = false;
  isLoading = false;
  loginError = '';

  constructor(private authService: AuthService, private router: Router) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.isLoading) return;
    this.loginError = '';
    this.isLoading = true;

    const payload: LoginRequest = {
      email: this.email,
      password: this.password,
      stayLoggedIn: true
    };

    this.authService.login(payload).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigateByUrl('/dashboard');
      },
      error: (err) => {
        this.isLoading = false;
        this.loginError =
          err.status === 401 || err.status === 400
            ? 'Incorrect email or password.'
            : 'Login failed. Please try again.';
      }
    });
  }
}
