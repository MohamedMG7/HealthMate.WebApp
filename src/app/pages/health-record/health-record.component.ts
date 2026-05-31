import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { LabTabComponent } from './lab-tab/lab-tab.component';
import { ImagingTabComponent } from './imaging-tab/imaging-tab.component';
import { MedicineTabComponent } from './medicine-tab/medicine-tab.component';
import { ConditionTabComponent } from './condition-tab/condition-tab.component';
import { PrescriptionTabComponent } from './prescription-tab/prescription-tab.component';
import { EncounterSessionService } from '../../services/encounter-session.service';
import { HealthRecordService } from '../../core/api/health-record.service';
import { HealthRecordSummary } from '../../core/models/health-record.models';

@Component({
  selector: 'app-health-record',
  standalone: true,
  imports: [
    CommonModule,
    LabTabComponent,
    ImagingTabComponent,
    MedicineTabComponent,
    ConditionTabComponent,
    PrescriptionTabComponent
  ],
  templateUrl: './health-record.component.html',
  styleUrls: ['./health-record.component.css']
})
export class HealthRecordComponent implements OnInit {
  patientId = '';
  patientName = '';
  patientNationalId = '';

  summary: HealthRecordSummary | null = null;
  loading = false;
  error: string | null = null;

  tabs = [
    { id: 'lab', label: 'Lab tests' },
    { id: 'imaging', label: 'Imaging' },
    { id: 'medicine', label: 'Medicine' },
    { id: 'condition', label: 'Condition' },
    { id: 'prescription', label: 'Prescription' }
  ];

  activeTab = 'lab';

  constructor(
    private router: Router,
    private encounterSessionService: EncounterSessionService,
    private healthRecordService: HealthRecordService
  ) {}

  ngOnInit(): void {
    this.patientNationalId = this.encounterSessionService.getPatientNationalId() || '';
    this.patientName = this.encounterSessionService.getPatientName() || '';
    this.patientId = this.encounterSessionService.getPatientId() || '';

    if (!this.patientId) {
      this.error = 'No patient selected. Please start an encounter first.';
      return;
    }

    const cached = this.encounterSessionService.getCachedHealthRecordSummary() as HealthRecordSummary | null;
    if (cached) {
      this.summary = cached;
      return;
    }

    this.loading = true;
    this.healthRecordService.getSummary(Number(this.patientId)).subscribe({
      next: (response) => {
        this.summary = response;
        this.encounterSessionService.setCachedHealthRecordSummary(response);
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load health record. Please try again.';
        this.loading = false;
      }
    });
  }

  retry(): void {
    this.error = null;
    this.loading = true;
    this.healthRecordService.getSummary(Number(this.patientId)).subscribe({
      next: (response) => {
        this.summary = response;
        this.encounterSessionService.setCachedHealthRecordSummary(response);
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load health record. Please try again.';
        this.loading = false;
      }
    });
  }

  selectTab(tabId: string): void {
    this.activeTab = tabId;
  }

  navigateBack(): void {
    this.router.navigate(['/encounter']);
  }
}
