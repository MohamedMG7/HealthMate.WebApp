// medical-image-details.component.ts
import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BASE_URL } from '../../services/config';
import { loadImage } from '../../services/loadPicture';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-medical-image-details',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './medical-image-details.component.html',
  styleUrls: ['./medical-image-details.component.css']
})
export class MedicalImageDetailsComponent implements OnInit {
  imageId: string = '';
  token: string = '';
  patientId: string = '';
  patientName: string = '';
  imageTitle: string = 'Medical Image';
  interpretation: string = '';
  imageUrl: string = '';
  hasImage: boolean = false;
  loadingError: string | null = null;

  constructor(private route: ActivatedRoute, private http: HttpClient, private sessionService: SessionService) {}

  ngOnInit(): void {
    this.token = this.sessionService.getToken() || '';
    this.imageId = this.route.snapshot.paramMap.get('id') || '';

    if (this.imageId) {
      this.fetchImageDetails();
    } else {
      this.loadingError = 'No image ID found.';
    }
  }

  fetchImageDetails(): void {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    this.http.get<any>(`${BASE_URL}HealthRecord/medical-image-details/${this.imageId}`, { headers })
      .subscribe({
        next: data => {
          console.log('Medical Image Details:', data);
          
          this.patientId = data.patientNationalId || '';
          this.patientName = data.patientName || '';
          this.imageTitle = data.medicalImageName || 'Medical Image';
          this.interpretation = data.interpretation || '';
          
          if (data.imageUrl) {
            this.imageUrl = data.imageUrl;
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
          console.error('Fetch error:', err);
          this.loadingError = `Error loading medical image details: ${err.statusText || err.message}`;
        }
      });
  }
}