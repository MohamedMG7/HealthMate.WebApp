import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ClinicDashboard } from '../models/dashboard.models';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor(private http: HttpClient) {}

  getClinicDashboard(hcpId: string): Observable<ClinicDashboard> {
    return this.http.get<ClinicDashboard>(
      `${environment.apiBaseUrl}HealthCareProvider/ClinicDashboard?HealthCareProviderId=${hcpId}`
    );
  }
}
