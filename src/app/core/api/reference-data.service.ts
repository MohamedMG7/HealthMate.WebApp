import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Disease, BodySite, Medicine } from '../models/reference-data.models';

@Injectable({ providedIn: 'root' })
export class ReferenceDataService {
  constructor(private http: HttpClient) {}

  getDiseases(): Observable<Disease[]> {
    return this.http.get<Disease[]>(`${environment.apiBaseUrl}Disease/get-diseases`);
  }

  getBodySites(): Observable<BodySite[]> {
    return this.http.get<BodySite[]>(`${environment.apiBaseUrl}bodySite/Get-All-Body-Sites-Name-Id`);
  }

  getMedicines(): Observable<Medicine[]> {
    return this.http.get<Medicine[]>(`${environment.apiBaseUrl}Medicine`);
  }
}
