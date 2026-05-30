import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HealthRecordSummary } from '../models/health-record.models';

@Injectable({ providedIn: 'root' })
export class HealthRecordService {
  constructor(private http: HttpClient) {}

  getSummary(patientId: number): Observable<HealthRecordSummary> {
    return this.http.get<HealthRecordSummary>(
      `${environment.apiBaseUrl}HealthRecord/summary/${Number(patientId)}`
    );
  }
}
