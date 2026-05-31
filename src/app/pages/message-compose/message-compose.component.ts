import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PopupMessageService } from '../../services/popup-message.service';
import { MessageService } from '../../core/api/message.service';
import { Receiver } from '../../core/models/message.models';

@Component({
  selector: 'app-message-compose',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './message-compose.component.html'
})
export class MessageComposeComponent implements OnInit {
  receivers: Receiver[] = [];
  filteredReceivers: Receiver[] = [];
  receiverSearch = '';
  selectedReceiverId: string = '';
  subject = '';
  body = '';

  constructor(
    private messageService: MessageService,
    private router: Router,
    private popupMessage: PopupMessageService
  ) {}

  ngOnInit(): void {
    this.messageService.getReceivers().subscribe({
      next: (data) => {
        this.receivers = data;
        this.filteredReceivers = data;
      },
      error: () => {
        this.popupMessage.showFailure('Failed to load receivers. Please try again.');
      }
    });
  }

  filterReceivers() {
    const keyword = this.receiverSearch.toLowerCase();
    this.filteredReceivers = this.receivers.filter(r =>
      r.name.toLowerCase().includes(keyword) || r.nationlId.includes(keyword)
    );
  }

  sendMessage() {
    if (!this.selectedReceiverId || !this.subject || !this.body) {
      this.popupMessage.showFailure('Please fill all fields.');
      return;
    }

    const payload = {
      receiverId: this.selectedReceiverId,
      subject: this.subject,
      body: this.body
    };

    this.messageService.send(payload).subscribe({
      next: () => {
        this.popupMessage.showSuccess('Message sent successfully');
        this.router.navigate(['/messages']);
      },
      error: () => {
        this.popupMessage.showFailure('Failed to send message');
      }
    });
  }
}
