import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MessageService } from '../../core/api/message.service';
import { MessageDetail } from '../../core/models/message.models';

@Component({
  selector: 'app-message-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './message-details.component.html'
})
export class MessageDetailsComponent implements OnInit {
  message: MessageDetail | null = null;
  loading = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.error = true;
      this.loading = false;
      return;
    }

    this.messageService.getMessage(id).subscribe({
      next: (data) => {
        this.message = data;
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }
}
