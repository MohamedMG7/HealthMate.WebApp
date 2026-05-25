import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-prescription-tab',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './prescription-tab.component.html',
  styleUrls: ['./prescription-tab.component.css']
})
export class PrescriptionTabComponent {
  @Input() prescriptions: any[] = [];
  constructor(private router: Router) {}
  

  onPrescriptionClick(prescriptionId: string): void {
    sessionStorage.setItem('selectedPrescriptionId', prescriptionId);
    this.router.navigate(['/prescription-details',prescriptionId]); // 🔁 Adjust if needed
  }

}
