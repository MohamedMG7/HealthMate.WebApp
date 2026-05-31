import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EncounterSessionService } from '../../services/encounter-session.service';
import { PopupMessageService } from '../../services/popup-message.service';
import { SessionService } from '../../services/session.service';
import { EncounterLifecycleService } from '../../core/api/encounter-lifecycle.service';
import { FinalizeEncounterInput } from '../../core/models/encounter-lifecycle.models';
import { ReferenceDataService } from '../../core/api/reference-data.service';

@Component({
  selector: 'app-encounter-confirmation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './encounter-confirmation.component.html',
  styleUrl: './encounter-confirmation.component.css'
})
export class EncounterConfirmationComponent implements OnInit {
  encounterInfo: any;
  prescriptions: any[] = [];
  condition: any = null;
  observations: any[] = [];
  labTest: any = null;

  medicines: any[] = [];
  medicineMap: { [id: number]: string } = {};
  diseaseMap: { [id: number]: string } = {};

  submitting = false;

  constructor(
    public router: Router,
    private referenceDataService: ReferenceDataService,
    private encounterService: EncounterSessionService,
    private popupService: PopupMessageService,
    private sessionService: SessionService,
    private encounterLifecycleService: EncounterLifecycleService
  ) {}

  ngOnInit(): void {
    this.encounterInfo = this.encounterService.getEncounterInfo();
    this.condition = this.encounterService.getCondition();
    this.observations = this.encounterService.getObservations();
    this.labTest = this.encounterService.getLabTest();
    this.prescriptions = this.encounterService.getPrescriptionMedicines();

    this.loadMedicines();
    this.loadDiseases();
  }

  loadMedicines(): void {
    this.referenceDataService.getMedicines().subscribe({
      next: (res) => {
        this.medicines = res;
        this.medicineMap = res.reduce((map, med) => {
          map[med.id] = med.name;
          return map;
        }, {} as { [id: number]: string });
      },
      error: (err) => {
        this.popupService.showFailure('Failed to load medicine names.');
      }
    });
  }

  getMedicineNameById(id: number): string {
    return this.medicineMap[id] || 'Unknown';
  }

  loadDiseases(): void {
    this.referenceDataService.getDiseases().subscribe({
      next: (res) => {
        this.diseaseMap = res.reduce((map, disease) => {
          map[disease.id] = disease.name;
          return map;
        }, {} as { [id: number]: string });

        if (this.condition && this.condition.diseasesId) {
          this.condition.diseaseName = this.diseaseMap[this.condition.diseasesId] || 'Unknown';
        }
      },
      error: (err) => {
        this.popupService.showFailure('Failed to load disease names.');
      }
    });
  }

  submitEncounter(): void {
    if (this.submitting) return;
    this.submitting = true;

    const patientId = Number(this.encounterService.getPatientId());
    const hcpId = Number(this.sessionService.getHealthcareProviderId());
    const condition = this.encounterService.getCondition();
    const meds = this.encounterService.getPrescriptionMedicines();

    const input: FinalizeEncounterInput = {
      start: {
        patientId,
        healthCareProviderId: hcpId,
        reasonToVisit: this.encounterInfo.reasonToVisit || ''
      },
      end: {
        treatmentPlan: this.encounterInfo.treatmentPlan || '',
        note: this.encounterInfo.note || undefined
      }
    };

    if (condition) {
      input.condition = {
        diseaseId: condition.diseasesId,
        severity: condition.severity,
        clinicalStatus: condition.clinicalStatus,
        dateRecorded: new Date().toISOString(),
        note: condition.note || undefined
      };
    }

    if (meds.length > 0) {
      input.prescription = {
        publisher: this.sessionService.getUsername() ?? null,
        medicines: meds.map((m: any) => ({
          medicineId: m.medicineId,
          dosage: m.dosage,
          frequencyInHours: m.frequencyInHours,
          durationInDays: m.durationInDays
        }))
      };
    }

    this.encounterLifecycleService.finalize(input).subscribe({
      next: () => {
        this.popupService.showSuccess('Encounter submitted successfully!');
        this.encounterService.clearEncounterSession();
        this.router.navigate(['/encounter']);
      },
      error: (err) => {
        console.error('Error submitting encounter:', err);
        this.popupService.showFailure('Failed to submit encounter. Please try again.');
        this.submitting = false;
      }
    });
  }
}
