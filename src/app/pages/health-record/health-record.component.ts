import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BASE_URL } from '../../services/config';

// Tab components
import { LabTabComponent } from './lab-tab/lab-tab.component';
import { ImagingTabComponent } from './imaging-tab/imaging-tab.component';
import { MedicineTabComponent } from './medicine-tab/medicine-tab.component';
import { ConditionTabComponent } from './condition-tab/condition-tab.component';
import { PrescriptionTabComponent } from './prescription-tab/prescription-tab.component';
import { SessionService } from '../../services/session.service';
import { EncounterSessionService } from '../../services/encounter-session.service';

@Component({
  selector: 'app-health-record',
  standalone: true,
  imports: [
    CommonModule,
    LabTabComponent,
    ImagingTabComponent,
    MedicineTabComponent,
    ConditionTabComponent,
    PrescriptionTabComponent
  ],
  templateUrl: './health-record.component.html',
  styleUrls: ['./health-record.component.css']
})
export class HealthRecordComponent implements OnInit {
  patientId = '';
  patientName = '';
  patientNationalId : string = ''
  token: string = '';
  data: any = null;

  tabs = [
    { id: 'lab', label: 'Lab tests' },
    { id: 'imaging', label: 'Imaging' },
    { id: 'medicine', label: 'Medicine' },
    { id: 'condition', label: 'Condition' },
    { id: 'prescription', label: 'Prescription' }
  ];

  activeTab = 'lab';

  constructor(private router: Router, private http: HttpClient, private sessionService: SessionService, private encounterSessionService: EncounterSessionService) {}

  ngOnInit(): void {
    // Get info from session
    this.patientNationalId = this.encounterSessionService.getPatientNationalId() || '';
    this.patientName = this.encounterSessionService.getPatientName() || '';
    this.patientId = this.encounterSessionService.getPatientId() || '';
    this.token = this.sessionService.getToken() || '';
  
    if (!this.token || !this.patientId) {
      console.error('Missing token or patientId in session storage.');
      return;
    }
  
    // Check if data is cached
    const cachedData = this.encounterSessionService.getCachedHealthRecordSummary();
    if (cachedData) {
      this.data = cachedData;
      //console.log('📦 Loaded health record data from cache.');
      return;
    }
  
    // If not cached, fetch from API
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${this.token}`
    });
  
    const url = `${BASE_URL}HealthRecord/Summary/${this.patientId}`;
    console.log('🌐 Requesting Health Record:', url);
  
    this.http.get(url, { headers }).subscribe({
      next: (response: any) => {
        console.log('✅ Health record data received:', response);
        this.data = response;
        this.encounterSessionService.setCachedHealthRecordSummary(response); // ✅ Cache it
      },
      error: (err) => {
        console.error('❌ Failed to fetch health record:', err);
      }
    });
  }

  selectTab(tabId: string): void {
    this.activeTab = tabId;
  }

  navigateBack(): void {
    this.router.navigate(['/encounter']);
  }
}
 