import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TrafficReport } from '../models/report.models';

@Injectable({ providedIn: 'root' })
export class ReporterService {
  constructor(private http: HttpClient) {}

  getTrafficReport(healthcareProviderId: string | number): Observable<TrafficReport> {
    return this.http.get<TrafficReport>(
      `${environment.apiBaseUrl}Reporter/Traffic-Report?healthcareProviderId=${healthcareProviderId}`
    );
  }
}
