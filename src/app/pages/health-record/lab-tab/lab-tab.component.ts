import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LabTestSummary } from '../../../core/models/health-record.models';

@Component({
  selector: 'app-lab-tab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lab-tab.component.html',
  styleUrls: ['./lab-tab.component.css']
})
export class LabTabComponent {
  @Input() labTests: LabTestSummary[] = [];

  constructor(private router: Router) {}

  onLabTestClick(labTestId: number): void {
    this.router.navigate(['/labtest-details', labTestId]);
  }

}
