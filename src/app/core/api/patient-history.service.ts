import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EncounterHistoryPage } from '../models/encounter.models';

@Injectable({ providedIn: 'root' })
export class PatientHistoryService {
  constructor(private http: HttpClient) {}

  getEncounters(patientId: string, page: number, pageSize = 20): Observable<EncounterHistoryPage> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<EncounterHistoryPage>(
      `${environment.apiBaseUrl}Patient/${patientId}/encounters`,
      { params }
    );
  }
}
