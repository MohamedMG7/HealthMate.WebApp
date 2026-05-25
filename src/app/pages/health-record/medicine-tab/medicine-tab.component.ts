import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-medicine-tab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './medicine-tab.component.html',
  styleUrls: ['./medicine-tab.component.css']
})
export class MedicineTabComponent {
  @Input() medicines: any[] = [];
}
