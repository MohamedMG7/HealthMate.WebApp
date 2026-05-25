import { Component, OnInit } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../../services/config';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  oldPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  name: string = '';
  email: string = '';
  specialization: string = '';

  constructor(private http: HttpClient, private sessionService: SessionService) {}

  ngOnInit(): void {
    // Fill in from session service
    this.name = this.sessionService.getUsername() ?? '';
    this.email = this.sessionService.gethcpMail() ?? '';
    this.specialization = this.sessionService.getSpecialization() ?? '';

  }

  resetPassword() {
    const token = this.sessionService.getToken();
    const applicationUserId = this.sessionService.getApplicationUserId();

    if (!applicationUserId) {
      alert("User ID not found.");
      return;
    }

    if (!this.oldPassword || !this.newPassword || !this.confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      alert("New password and confirmation do not match.");
      return;
    }

    const payload = {
      ApplicationUserId: applicationUserId,
      currentPassword: this.oldPassword,
      newPassword: this.newPassword
    };
    
    const headers = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    };

    this.http.post(`${BASE_URL}Account/resetpassword`, payload, headers).subscribe({
      next: () => {
        alert("Password reset successful!");
        this.oldPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
      },
      error: (err) => {
        console.error(err);
        alert("Failed to reset password. Please check your credentials.");
      }
    });
  }
}
