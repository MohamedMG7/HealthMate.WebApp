import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { StartEncounterResponse } from '../models/encounter-workspace.models';

@Injectable({ providedIn: 'root' })
export class EncounterApiService {
  constructor(private http: HttpClient) {}

  startEncounter(patientNationalId: string): Observable<StartEncounterResponse> {
    return this.http.get<StartEncounterResponse>(
      `${environment.apiBaseUrl}HealthCareProvider/StartEncounter?patientNationalId=${patientNationalId}`
    );
  }
}
