import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MessageService } from '../../core/api/message.service';
import { MessageSummary } from '../../core/models/message.models';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messages: MessageSummary[] = [];
  loading = true;
  error = false;

  constructor(private messageService: MessageService, private router: Router) {}

  ngOnInit(): void {
    this.messageService.getInbox().subscribe({
      next: (res) => {
        this.messages = res;
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }

  viewMessage(id: number) {
    const message = this.messages.find(m => m.id === id);

    if (message && !message.isRead) {
      this.messageService.markRead(id).subscribe({
        next: () => {
          message.isRead = true;
          this.router.navigate(['/message-details', id]);
        },
        error: () => {
          // Still navigate even if marking fails
          this.router.navigate(['/message-details', id]);
        }
      });
    } else {
      this.router.navigate(['/message-details', id]);
    }
  }
}
