import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { Router, RouterModule } from '@angular/router';
import { SessionService } from '../../services/session.service';
import { PopupMessageService } from '../../services/popup-message.service';

interface Receiver {
  id: string;
  name: string;
  nationlId: string;
}

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
  token = ''; // Set this from your session service or storage

  constructor(private http: HttpClient, private router: Router, private sessionService: SessionService, private popupMessage: PopupMessageService) {}

  ngOnInit(): void {
    this.token = this.sessionService.getToken() ?? '';

    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    this.http.get<Receiver[]>('https://healthmate.runasp.net/api/Message/available-receivers', { headers })
      .subscribe(data => {
        this.receivers = data;
        this.filteredReceivers = data;
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
      alert('Please fill all fields.');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    const payload = {
      receiverId: this.selectedReceiverId,
      subject: this.subject,
      body: this.body
    };

    this.http.post('https://healthmate.runasp.net/api/Message', payload, { headers })
      .subscribe({
        next: () => {
          this.popupMessage.showSuccess("Message sent successfully");
          this.router.navigate(['/messages']);
        },
        error: err => {
          console.error(err);
          alert('Failed to send message');
        }
      });
  }
}
