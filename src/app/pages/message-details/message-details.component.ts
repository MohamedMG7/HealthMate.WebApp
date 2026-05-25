import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-message-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './message-details.component.html'
})
export class MessageDetailsComponent implements OnInit {
  message: any = null;
  loading = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const token = this.sessionService.getToken() ?? '';

    if (!id || !token) {
      this.error = true;
      this.loading = false;
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `https://healthmate.runasp.net/api/Message/${id}`;

    this.http.get(url, { headers }).subscribe({
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
