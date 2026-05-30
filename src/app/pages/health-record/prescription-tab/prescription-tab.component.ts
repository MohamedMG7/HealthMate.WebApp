import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { PrescriptionSummary } from '../../../core/models/health-record.models';

@Component({
  selector: 'app-prescription-tab',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './prescription-tab.component.html',
  styleUrls: ['./prescription-tab.component.css']
})
export class PrescriptionTabComponent {
  @Input() prescriptions: PrescriptionSummary[] = [];

  constructor(private router: Router) {}

  onPrescriptionClick(prescriptionId: number): void {
    this.router.navigate(['/prescription-details', prescriptionId]);
  }
}
