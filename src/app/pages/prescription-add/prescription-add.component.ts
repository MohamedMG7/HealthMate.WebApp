import { Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BASE_URL } from '../../services/config';
import { EncounterSessionService } from '../../services/encounter-session.service';
import { RouterModule } from '@angular/router';
import { PopupMessageService } from '../../services/popup-message.service';

@Component({
  selector: 'app-prescription-add',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './prescription-add.component.html',
  styleUrls: ['./prescription-add.component.css']
})
export class PrescriptionAddComponent implements OnInit {
  patientNationalId: string = '';
  patientName: string = '';

  medicines: any[] = [];
  medicineMap: { [id: number]: string } = {}; 
  selectedMedicineId: number | null = null;

  dosage: string = '';
  frequencyInHours: number | null = null;
  durationInDays: number | null = null;

  prescriptionMedicines: any[] = [];

  constructor(
    private http: HttpClient,
    private encounterService: EncounterSessionService,
    private popupService: PopupMessageService
  ) {}

  ngOnInit(): void {
    this.patientNationalId = this.encounterService.getPatientNationalId() || '';
    this.patientName = this.encounterService.getPatientName() || '';
    this.loadMedicines();
    this.refreshPrescriptionTable();
  }

  loadMedicines(): void {
    this.http.get<any[]>(`${BASE_URL}medicine`).subscribe({
      next: (res) => {
        this.medicines = res;
        // lookup map to map the med id with it's name to show in the prescription table 
        this.medicineMap = res.reduce((map, med) => {
          map[med.id] = med.name;
          return map;
        }, {} as { [id: number]: string });
      },
      error: (err) => console.error('Error loading medicines:', err)
    });
  }

  addMedicineToPrescription(): void {
    if (!this.selectedMedicineId || !this.dosage || !this.frequencyInHours || !this.durationInDays) {
      this.popupService.showFailure('Please fill all fields');
      return;
    }

    if (this.durationInDays <= 0 || this.frequencyInHours <= 0) {
      this.popupService.showFailure('يخربيت العبط');
      return;
    }
  
    const medicine = {
      medicineId: this.selectedMedicineId,
      dosage: this.dosage,
      frequencyInHours: this.frequencyInHours,
      durationInDays: this.durationInDays,
      isPrescribed: true
    };

    this.encounterService.addPrescriptionMedicine(medicine);
    this.refreshPrescriptionTable();

    this.popupService.showSuccess('Medicine added to prescription');
    
    // Reset form
    this.selectedMedicineId = null;
    this.dosage = '';
    this.frequencyInHours = null;
    this.durationInDays = null;
  }

  refreshPrescriptionTable(): void {
    this.prescriptionMedicines = this.encounterService.getPrescriptionMedicines();
  }

  getMedicineNameById(id: number): string {
    return this.medicineMap[id] || 'Unknown';
  }

}
