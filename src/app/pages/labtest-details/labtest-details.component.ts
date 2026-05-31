// labtest-details.component.ts
import { Component, OnInit } from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { HealthRecordDetailsService } from '../../core/api/health-record-details.service';
import { LabTestResult } from '../../core/models/health-record-details.models';

@Component({
  selector: 'app-labtest-details',
  standalone: true,
  imports: [RouterModule], // Added CommonModule to fix *ngIf and *ngFor warnings
  templateUrl: './labtest-details.component.html',
  styleUrls: ['./labtest-details.component.css']
})
export class LabtestDetailsComponent implements OnInit {
  labTestId: string = '';
  patientId: string = '';
  patientName: string = '';
  labTestName: string = '';
  labTestResults: LabTestResult[] = [];
  loadingError: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private healthRecordDetailsService: HealthRecordDetailsService
  ) {}

  ngOnInit(): void {
    this.labTestId = this.route.snapshot.paramMap.get('id') || '';

    if (this.labTestId) {
      this.loadLabTestDetails();
    }
  }

  loadLabTestDetails(): void {
    this.healthRecordDetailsService.getLabTest(Number(this.labTestId)).subscribe({
      next: res => {
        this.patientId = res.patientNationalId;
        this.patientName = res.patientName;
        this.labTestName = res.labTestName;
        this.labTestResults = res.results || [];
      },
      error: err => {
        this.loadingError = `Error loading data: ${err.statusText || err.message}`;
      }
    });
  }
}
