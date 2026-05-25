import { Component } from '@angular/core';

import { RouterModule } from '@angular/router';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  username: string;
  email: string;

  constructor(private sessionService: SessionService) {
    this.username = this.sessionService.getUsername() || '';
    this.email = this.sessionService.gethcpMail() || '';
  }

  logout() {
    this.sessionService.clearSession();
    sessionStorage.clear();
    window.location.href = '/login';
  }
}