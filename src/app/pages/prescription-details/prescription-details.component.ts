import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { BASE_URL } from '../../services/config';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-prescription-details',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './prescription-details.component.html',
  styleUrls: ['./prescription-details.component.css']
})
export class PrescriptionDetailsComponent implements OnInit {
  token: string = '';
  prescriptionId: string = '';

  patientId: string = '';
  patientName: string = '';
  prescriptionDate: string = '';
  diseaseName: string = '';
  medicines: any[] = [];
  loadingError: string | null = null;

  constructor(private route: ActivatedRoute, private http: HttpClient, private sessionService: SessionService) {}

  ngOnInit(): void {
    this.token =this.sessionService.getToken() || '';
    this.prescriptionId = this.route.snapshot.paramMap.get('id') || '';

    if (this.prescriptionId) {
      this.loadPrescriptionDetails();
    } else {
      this.loadingError = 'No prescription ID found.';
    }
  }

  loadPrescriptionDetails(): void {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json'
    });

    this.http.get<any>(`${BASE_URL}HealthRecord/prescription-details/${this.prescriptionId}`, { headers })
      .subscribe({
        next: data => {
          this.patientId = data.patientNationalId || '';
          this.patientName = data.patientName || '';
          this.prescriptionDate = this.formatDate(data.prescriptionDate);
          this.diseaseName = data.diseaseName || '';
          this.medicines = data.medicines || [];
        },
        error: err => {
          this.loadingError = `Error loading prescription details: ${err.statusText || err.message}`;
        }
      });
  }

  formatDate(dateStr: string): string {
    if (!dateStr || dateStr.startsWith('0001-01-01')) {
      return 'Not specified';
    }
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-GB');
    } catch {
      return dateStr;
    }
  }
}
