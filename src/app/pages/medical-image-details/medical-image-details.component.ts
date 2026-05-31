// medical-image-details.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { loadImage } from '../../services/loadPicture';
import { HealthRecordDetailsService } from '../../core/api/health-record-details.service';

@Component({
  selector: 'app-medical-image-details',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './medical-image-details.component.html',
  styleUrls: ['./medical-image-details.component.css']
})
export class MedicalImageDetailsComponent implements OnInit {
  imageId: string = '';
  patientId: string = '';
  patientName: string = '';
  imageTitle: string = 'Medical Image';
  interpretation: string = '';
  imageUrl: string = '';
  hasImage: boolean = false;
  loadingError: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private healthRecordDetailsService: HealthRecordDetailsService
  ) {}

  ngOnInit(): void {
    this.imageId = this.route.snapshot.paramMap.get('id') || '';

    if (this.imageId) {
      this.fetchImageDetails();
    } else {
      this.loadingError = 'No image ID found.';
    }
  }

  fetchImageDetails(): void {
    this.healthRecordDetailsService.getMedicalImage(Number(this.imageId)).subscribe({
      next: res => {
        this.patientId = res.patientNationalId || '';
        this.patientName = res.patientName || '';
        this.imageTitle = res.medicalImageName || 'Medical Image';
        this.interpretation = res.interpretation || '';

        if (res.imageUrl) {
          this.imageUrl = res.imageUrl;
          this.hasImage = true;

          // Simple timeout to ensure DOM is ready, then load image
          setTimeout(() => {
            const imageElement = document.getElementById('medical-image') as HTMLImageElement;
            if (imageElement) {
              loadImage(this.imageUrl, imageElement);
            }
          }, 100);
        } else {
          this.hasImage = false;
        }
      },
      error: err => {
        this.loadingError = `Error loading medical image details: ${err.statusText || err.message}`;
      }
    });
  }
}
