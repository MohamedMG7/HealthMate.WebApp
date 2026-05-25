import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lab-tab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lab-tab.component.html',
  styleUrls: ['./lab-tab.component.css']
})
export class LabTabComponent {
  @Input() labTests: any[] = [];

  constructor(private router: Router) {}

  // ✅ Navigate using Angular route param (NO sessionStorage)
  onLabTestClick(labTestId: string): void {
    this.router.navigate(['/labtest-details', labTestId]);
  }

  addLabTest(): void {
    this.router.navigate(['/lab-test-add']);
  }
}
