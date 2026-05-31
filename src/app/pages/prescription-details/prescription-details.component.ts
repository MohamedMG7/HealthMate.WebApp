import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HealthRecordDetailsService } from '../../core/api/health-record-details.service';
import { MedicineDetails } from '../../core/models/health-record-details.models';

@Component({
  selector: 'app-prescription-details',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './prescription-details.component.html',
  styleUrls: ['./prescription-details.component.css']
})
export class PrescriptionDetailsComponent implements OnInit {
  prescriptionId: string = '';

  patientId: string = '';
  patientName: string = '';
  prescriptionDate: string = '';
  diseaseName: string = '';
  medicines: MedicineDetails[] = [];
  loadingError: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private healthRecordDetailsService: HealthRecordDetailsService
  ) {}

  ngOnInit(): void {
    this.prescriptionId = this.route.snapshot.paramMap.get('id') || '';

    if (this.prescriptionId) {
      this.loadPrescriptionDetails();
    } else {
      this.loadingError = 'No prescription ID found.';
    }
  }

  loadPrescriptionDetails(): void {
    this.healthRecordDetailsService.getPrescription(Number(this.prescriptionId)).subscribe({
      next: res => {
        this.patientId = res.patientNationalId || '';
        this.patientName = res.patientName || '';
        this.prescriptionDate = this.formatDate(res.prescriptionDate);
        this.diseaseName = res.diseaseName || '';
        this.medicines = res.medicines || [];
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
