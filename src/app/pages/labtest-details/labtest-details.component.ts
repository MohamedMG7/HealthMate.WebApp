// labtest-details.component.ts
import { Component, OnInit } from '@angular/core';

import { RouterModule, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BASE_URL } from '../../services/config';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-labtest-details',
  standalone: true,
  imports: [RouterModule], // Added CommonModule to fix *ngIf and *ngFor warnings
  templateUrl: './labtest-details.component.html',
  styleUrls: ['./labtest-details.component.css']
})
export class LabtestDetailsComponent implements OnInit {
  labTestId: string = '';
  token: string = '';
  patientId: string = '';
  patientName: string = '';
  labTestName: string = '';
  labTestResults: any[] = [];
  loadingError: string | null = null;

  constructor(private route: ActivatedRoute, private http: HttpClient, private sessionService:SessionService) {}

  ngOnInit(): void {
    this.token = this.sessionService.getToken() || '';
    this.labTestId = this.route.snapshot.paramMap.get('id') || '';

    if (this.labTestId) {
      this.loadLabTestDetails();
    }
  }

  loadLabTestDetails(): void {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    this.http.get<any>(`${BASE_URL}HealthRecord/lab-test-details/${this.labTestId}`, { headers })
      .subscribe({
        next: data => {
          console.log('Lab Test Details:', data);
          this.patientId = data.patientNationalId;
          this.patientName = data.patientName;
          this.labTestName = data.labTestName;
          this.labTestResults = data.results || [];
        },
        error: err => {
          console.error('Fetch error:', err);
          this.loadingError = `Error loading data: ${err.statusText || err.message}`;
        }
      });
  }
}