import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-imaging-tab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './imaging-tab.component.html',
  styleUrls: ['./imaging-tab.component.css']
})
export class ImagingTabComponent {
  @Input() images: any[] = [];

  constructor(private router: Router) {}

  onImageClick(imageId: string): void {
    sessionStorage.setItem('selectedMedicalImageId', imageId);
    this.router.navigate(['/medical-image-details', imageId]); 
  }

  addImage(): void {
    this.router.navigate(['/imaging-add']); // 🔁 adjust based on your route
  }
}
