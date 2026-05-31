import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ConditionSummary } from '../../../core/models/health-record.models';

@Component({
  selector: 'app-condition-tab',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './condition-tab.component.html',
  styleUrls: ['./condition-tab.component.css']
})
export class ConditionTabComponent {
  @Input() conditions: ConditionSummary[] = [];
}
