import { Component, OnInit } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { EncounterSessionService } from '../../services/encounter-session.service';
import { RouterModule } from '@angular/router';
import { PopupMessageService } from '../../services/popup-message.service';
import { ReferenceDataService } from '../../core/api/reference-data.service';
import { Disease, BodySite } from '../../core/models/reference-data.models';

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

  diseases: Disease[] = [];
  bodySites: BodySite[] = [];

  filteredDiseases: Disease[] = [];
  filteredBodySites: BodySite[] = [];

  constructor(
    private referenceDataService: ReferenceDataService,
    private encounterService: EncounterSessionService,
    private popupService: PopupMessageService
  ) {}

  ngOnInit(): void {
    this.patientId = this.encounterService.getPatientNationalId() || '';
    this.patientName = this.encounterService.getPatientName() || '';
    this.fetchDiseases();
    this.fetchBodySites();
  }

  fetchDiseases() {
    this.referenceDataService.getDiseases().subscribe({
      next: (res) => {
        this.diseases = res;
        this.filteredDiseases = res;
      },
      error: (err) => this.popupService.showFailure('Failed to load diseases. Please try again.')
    });
  }

  fetchBodySites() {
    this.referenceDataService.getBodySites().subscribe({
      next: (res) => {
        this.bodySites = res;
        this.filteredBodySites = res;
      },
      error: (err) => this.popupService.showFailure('Failed to load body sites. Please try again.')
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
