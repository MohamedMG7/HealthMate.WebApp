import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messages: any[] = [];
  loading = true;

  constructor(private http: HttpClient, private router: Router, private sessionService: SessionService) {}

  ngOnInit(): void {
    const token = this.sessionService.getToken() || '';
    const headers = { Authorization: `Bearer ${token}` };

    this.http.get('https://healthmate.runasp.net/api/Message/inbox', { headers }).subscribe({
      next: (res: any) => {
        this.messages = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load inbox', err);
        this.loading = false;
      }
    });
  }

  viewMessage(id: number) {
    const message = this.messages.find(m => m.id === id);
    const token = this.sessionService.getToken() || '';
    const headers = { Authorization: `Bearer ${token}` };
  
    // If message is unread, mark it as read first
    if (message && !message.isRead) {
      this.http.post(`https://healthmate.runasp.net/api/Message/${id}/read`, {}, { headers }).subscribe({
        next: () => {
          // Optionally update UI locally
          message.isRead = true;
          this.router.navigate(['/message-details', id]);
        },
        error: (err) => {
          console.error(`Failed to mark message ${id} as read`, err);
          // Still navigate even if marking fails
          this.router.navigate(['/message-details', id]);
        }
      });
    } else {
      // Already read, just navigate
      this.router.navigate(['/message-details', id]);
    }
  }
  
}
