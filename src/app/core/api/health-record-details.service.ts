import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  LabTestDetails,
  MedicalImageDetails,
  PrescriptionDetails,
  EncounterDetails
} from '../models/health-record-details.models';

@Injectable({ providedIn: 'root' })
export class HealthRecordDetailsService {
  constructor(private http: HttpClient) {}

  getLabTest(id: number): Observable<LabTestDetails> {
    return this.http.get<LabTestDetails>(
      `${environment.apiBaseUrl}HealthRecord/lab-test-details/${Number(id)}`
    );
  }

  getMedicalImage(id: number): Observable<MedicalImageDetails> {
    return this.http.get<MedicalImageDetails>(
      `${environment.apiBaseUrl}HealthRecord/medical-image-details/${Number(id)}`
    );
  }

  getPrescription(id: number): Observable<PrescriptionDetails> {
    return this.http.get<PrescriptionDetails>(
      `${environment.apiBaseUrl}HealthRecord/prescription-details/${Number(id)}`
    );
  }

  getEncounter(id: number): Observable<EncounterDetails> {
    return this.http.get<EncounterDetails>(
      `${environment.apiBaseUrl}HealthRecord/encounter-details/${Number(id)}`
    );
  }
}
