import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MedicalImageSummary } from '../../../core/models/health-record.models';

@Component({
  selector: 'app-imaging-tab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './imaging-tab.component.html',
  styleUrls: ['./imaging-tab.component.css']
})
export class ImagingTabComponent {
  @Input() images: MedicalImageSummary[] = [];

  constructor(private router: Router) {}

  onImageClick(imageId: number): void {
    this.router.navigate(['/medical-image-details', imageId]);
  }

  addImage(): void {
    this.router.navigate(['/imaging-add']);
  }
}
