import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HealthRecordDetailsService } from '../../core/api/health-record-details.service';
import { ConditionDetails, MedicineDetails } from '../../core/models/health-record-details.models';

@Component({
  selector: 'app-encounter-details',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './encounter-details.component.html',
})
export class EncounterDetailsComponent implements OnInit {
  encounterId: string = '';

  patientId: string = '';
  patientName: string = '';
  doctorName: string = '';
  date: string = '';

  reasonToVisit: string = '';
  treatmentPlan: string = '';
  note: string = '';

  conditions: ConditionDetails[] = [];
  prescription: MedicineDetails[] = [];
  loadingError: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private healthRecordDetailsService: HealthRecordDetailsService
  ) {}

  ngOnInit(): void {
    this.encounterId = this.route.snapshot.paramMap.get('id') || '';

    if (this.encounterId) {
      this.fetchEncounterDetails();
    } else {
      this.loadingError = 'No encounter ID provided.';
    }
  }

  fetchEncounterDetails(): void {
    this.healthRecordDetailsService.getEncounter(Number(this.encounterId)).subscribe({
      next: res => {
        this.patientId = res.patientNationalId;
        this.patientName = res.patientName;
        this.doctorName = res.healthCareProviderName;
        this.date = res.date;
        this.reasonToVisit = res.reason_To_Visit;
        this.treatmentPlan = res.treatment_Plan;
        this.note = res.note;
        this.conditions = res.conditions || [];
        this.prescription = res.prescription || [];
      },
      error: err => {
        this.loadingError = 'Failed to load encounter details.';
      }
    });
  }
}
