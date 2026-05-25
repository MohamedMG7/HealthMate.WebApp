import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // ✅ Add this

@Component({
  selector: 'app-condition-tab',
  standalone: true,
  imports: [CommonModule, RouterModule], // ✅ Add RouterModule here
  templateUrl: './condition-tab.component.html',
  styleUrls: ['./condition-tab.component.css']
})
export class ConditionTabComponent {
  @Input() conditions: any[] = [];
}
