import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EncounterSessionService {

  private cachedPatientData: any = null;

  setCachedPatientData(data: any) {
    this.cachedPatientData = data;
  }

  getCachedPatientData(): any {
    return this.cachedPatientData;
  }

  clearCachedPatientData() {
    this.cachedPatientData = null;
  }

  private cachedHealthRecordSummary: any = null;

  setCachedHealthRecordSummary(data: any) {
    this.cachedHealthRecordSummary = data;
  }

  getCachedHealthRecordSummary(): any {
    return this.cachedHealthRecordSummary;
  }

  clearCachedHealthRecordSummary() {
    this.cachedHealthRecordSummary = null;
  }

  private patientNationalId: string = '';
  private patientId: string = '';
  private patientName: string = '';

  getPatientId(): string | undefined {
    return this.patientId;
  }

  setPatientId(patientId: string) {
    this.patientId = patientId;
  }

  getPatientNationalId(): string | undefined {
    return this.patientNationalId;
  }

  setPatientNationalId(patientNationalId: string) {
    this.patientNationalId = patientNationalId;
  }

  getPatientName(): string | undefined {
    return this.patientName;
  }

  setPatientName(patientName: string) {
    this.patientName = patientName;
  }

  private encounterSession: any = {
    encounter: {
      startDate: new Date().toISOString(),
      endDate: null,
      reason_To_Visit: '',
      treatment_Plan: '',
      note: ''
    }
  };

  setOverlayShown(value: boolean): void {
    if (value) {
      sessionStorage.setItem('overlayShown', 'true');
    } else {
      sessionStorage.removeItem('overlayShown');
    }
  }

  getOverlayShown(): boolean {
    return sessionStorage.getItem('overlayShown') === 'true';
  }

  setEncounterStartDate() {
    this.encounterSession.encounter.startDate = new Date().toISOString();
  }

  setEncounterEndDate() {
    this.encounterSession.encounter.endDate = new Date().toISOString();
  }

  setEncounterInfo(data: { reasonToVisit: string; treatmentPlan: string; note: string }) {
    this.encounterSession.encounter = {
      ...this.encounterSession.encounter,
      reason_To_Visit: data.reasonToVisit,
      treatment_Plan: data.treatmentPlan,
      note: data.note
    };
  }

  addCondition(condition: any) {
    this.encounterSession.condition = {
      diseasesId: condition.diseasesId,
      dateRecorded: new Date().toISOString(),
      clinicalStatus: condition.clinicalStatus,
      recorder: condition.recorder,
      severity: condition.severity,
      bodySite: condition.bodySite,
      note: condition.note
    };
  }

  getFullEncounterData(): any {
    return this.encounterSession;
  }

  clearEncounterSession() {
    this.reset();
    sessionStorage.removeItem('overlayShown');
    this.resetSessionPatientData();
    this.clearCachedPatientData();
    this.clearCachedHealthRecordSummary();
  }

  reset() {
    this.encounterSession = {
      encounter: {
        startDate: new Date().toISOString(),
        endDate: null,
        reason_To_Visit: '',
        treatment_Plan: '',
        note: ''
      }
    };
  }

  addPrescriptionMedicine(medicine: any) {
    if (!this.encounterSession.prescription) {
      this.encounterSession.prescription = {
        prescriptionDate: new Date().toISOString(),
        medicines: []
      };
    }
    this.encounterSession.prescription.medicines.push(medicine);
  }

  getPrescriptionMedicines(): any[] {
    return this.encounterSession.prescription?.medicines || [];
  }

  resetSessionPatientData() {
    this.setPatientId('');
    this.setPatientName('');
    this.setPatientNationalId('');
  }

  getEncounterInfo() {
    return this.encounterSession.encounter || {};
  }

  getCondition(): any {
    return this.encounterSession.condition || null;
  }

  getObservations(): any[] {
    return this.encounterSession.observations || [];
  }

  getLabTest(): any {
    return this.encounterSession.labTests || null;
  }
}
