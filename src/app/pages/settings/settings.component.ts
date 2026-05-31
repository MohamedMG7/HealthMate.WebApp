import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SessionService } from '../../services/session.service';
import { AccountService } from '../../core/api/account.service';
import { PopupMessageService } from '../../services/popup-message.service';

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

  constructor(
    private sessionService: SessionService,
    private accountService: AccountService,
    private popupMessage: PopupMessageService
  ) {}

  ngOnInit(): void {
    this.name = this.sessionService.getUsername() ?? '';
    this.email = this.sessionService.gethcpMail() ?? '';
    this.specialization = this.sessionService.getSpecialization() ?? '';
  }

  resetPassword(): void {
    const applicationUserId = this.sessionService.getApplicationUserId();

    if (!applicationUserId) {
      this.popupMessage.showFailure('User ID not found.');
      return;
    }

    if (!this.oldPassword || !this.newPassword || !this.confirmPassword) {
      this.popupMessage.showFailure('Please fill in all fields.');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.popupMessage.showFailure('New password and confirmation do not match.');
      return;
    }

    this.accountService.resetPassword({
      ApplicationUserId: applicationUserId,
      currentPassword: this.oldPassword,
      newPassword: this.newPassword
    }).subscribe({
      next: () => {
        this.popupMessage.showSuccess('Password reset successful!');
        this.oldPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
      },
      error: () => {
        this.popupMessage.showFailure('Failed to reset password. Please check your current password and try again.');
      }
    });
  }
}
