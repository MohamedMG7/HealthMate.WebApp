import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { BASE_URL } from '../../services/config';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-encounter-details',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './encounter-details.component.html',
})
export class EncounterDetailsComponent implements OnInit {
  token: string = '';
  encounterId: string = '';

  patientId: string = '';
  patientName: string = '';
  doctorName: string = '';
  date: string = '';

  reasonToVisit: string = '';
  treatmentPlan: string = '';
  note: string = '';

  conditions: any[] = [];
  prescription: any[] = [];
  loadingError: string | null = null;

  constructor(private route: ActivatedRoute, private http: HttpClient, private sessionService:SessionService) {}

  ngOnInit(): void {
    this.token = this.sessionService.getToken() || '';
    this.encounterId = this.route.snapshot.paramMap.get('id') || '';

    if (this.encounterId) {
      this.fetchEncounterDetails();
    } else {
      this.loadingError = 'No encounter ID provided.';
    }
  }

  fetchEncounterDetails(): void {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });

    this.http
      .get<any>(`${BASE_URL}HealthRecord/encounter-details/${this.encounterId}`, { headers })
      .subscribe({
        next: (data) => {
          this.patientId = data.patientNationalId;
          this.patientName = data.patientName;
          this.doctorName = data.healthCareProviderName;
          this.date = data.date;
          this.reasonToVisit = data.reason_To_Visit;
          this.treatmentPlan = data.treatment_Plan;
          this.note = data.note;
          this.conditions = data.conditions || [];
          this.prescription = data.prescription || [];
        },
        error: (err) => {
          this.loadingError = 'Failed to load encounter details.';
          console.error(err);
        },
      });
  }
}
