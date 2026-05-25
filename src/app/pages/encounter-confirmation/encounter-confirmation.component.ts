import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { EncounterSessionService } from '../../services/encounter-session.service';
import { PopupMessageService } from '../../services/popup-message.service';
import { SessionService } from '../../services/session.service';
import { BASE_URL } from '../../services/config';

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

  constructor(
    public router: Router,
    private http: HttpClient,
    private encounterService: EncounterSessionService,
    private popupService: PopupMessageService,
    private sessionService: SessionService
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
    this.http.get<any[]>(`${BASE_URL}medicine`).subscribe({
      next: (res) => {
        this.medicines = res;
        this.medicineMap = res.reduce((map, med) => {
          map[med.id] = med.name;
          return map;
        }, {} as { [id: number]: string });
      },
      error: (err) => {
        console.error('Error loading medicines:', err);
        this.popupService.showFailure('Failed to load medicine names.');
      }
    });
  }

  getMedicineNameById(id: number): string {
    return this.medicineMap[id] || 'Unknown';
  }

  loadDiseases(): void {
    this.http.get<any[]>(`${BASE_URL}Disease/get-diseases`).subscribe({
      next: (res) => {
        this.diseaseMap = res.reduce((map, disease) => {
          map[disease.id] = disease.name;
          return map;
        }, {} as { [id: number]: string });

        // Patch condition name for display
        if (this.condition && this.condition.diseasesId) {
          this.condition.diseaseName = this.diseaseMap[this.condition.diseasesId] || 'Unknown';
        }
      },
      error: (err) => {
        console.error('Error loading diseases:', err);
        this.popupService.showFailure('Failed to load disease names.');
      }
    });
  }

  submitEncounter(): void {
    // Save final user edits (reasonToVisit, note, treatmentPlan)
    this.encounterService.setEncounterInfo(this.encounterInfo);

    this.encounterService.endEncounter().then(result => {
      if (result.success) {
        this.popupService.showSuccess('Encounter submitted successfully!');
        this.router.navigate(['/encounter']);
      } else {
        this.popupService.showFailure('Failed to submit encounter.');
      }
    }).catch(err => {
      console.error('Error submitting encounter:', err);
      this.popupService.showFailure('An error occurred while submitting encounter.');
    });
  }
}
