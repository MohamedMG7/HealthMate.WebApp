import { Component, OnInit } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { EncounterSessionService } from '../../services/encounter-session.service';
import { BASE_URL } from '../../services/config';
import { RouterModule } from '@angular/router';
import { PopupMessageService } from '../../services/popup-message.service';

@Component({
  selector: 'app-condition-add',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './condition-add.component.html',
  styleUrls: ['./condition-add.component.css']
})
export class ConditionAddComponent implements OnInit {
  patientId: string = '';
  patientName: string = '';

  conditionName = '';
  bodySiteName = '';
  severity = 0;
  note = '';

  selectedBodySiteId: number | null = null;

  diseases: any[] = [];
  bodySites: any[] = [];

  filteredDiseases: any[] = [];
  filteredBodySites: any[] = [];

  constructor(private http: HttpClient, private encounterService: EncounterSessionService,private popupService: PopupMessageService) {}

  ngOnInit(): void {
    this.patientId = this.encounterService.getPatientNationalId() || '';
    this.patientName = this.encounterService.getPatientName() || '';
    this.fetchDiseases();
    this.fetchBodySites();
  }

  fetchDiseases() {
    this.http.get<any[]>(`${BASE_URL}Disease/get-diseases`).subscribe({
      next: (res) => {
        this.diseases = res;
        this.filteredDiseases = res;
      },
      error: (err) => console.error('Error fetching diseases:', err)
    });
  }

  fetchBodySites() {
    this.http.get<any[]>(`${BASE_URL}bodySite/Get-All-Body-Sites-Name-Id`).subscribe({
      next: (res) => {
        this.bodySites = res;
        this.filteredBodySites = res;
      },
      error: (err) => console.error('Error fetching body sites:', err)
    });
  }

  submitCondition() {
    const disease = this.diseases.find(d => d.name.toLowerCase() === this.conditionName.toLowerCase());
  
    if (!disease) {
      this.popupService.showFailure('Please select a valid disease');
      return;
    }
  
    const condition: any = {
      diseasesId: disease.id,
      clinicalStatus: 0,
      recorder: 1,
      severity: this.severity,
      note: this.note
    };
  
    if (this.selectedBodySiteId !== null) {
      condition.bodySite = this.selectedBodySiteId;
    }
  
    this.encounterService.addCondition(condition);
    this.popupService.showSuccess('Condition added to encounter!');
  }
}
