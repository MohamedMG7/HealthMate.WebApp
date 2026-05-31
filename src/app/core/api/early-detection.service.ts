import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EarlyDetectionResult } from '../models/early-detection.models';

@Injectable({ providedIn: 'root' })
export class EarlyDetectionService {
  constructor(private http: HttpClient) {}

  predict(model: string, features: Record<string, number>): Observable<EarlyDetectionResult> {
    return this.http.post<EarlyDetectionResult>(
      `${environment.apiBaseUrl}EDEngine/predict/${model}`,
      features
    );
  }
}
