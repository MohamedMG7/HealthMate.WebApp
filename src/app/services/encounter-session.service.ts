import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BASE_URL } from './config';
import { SessionService } from './session.service';

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

  // attributes getters and setters
  getPatientId(): string | undefined{
    return this.patientId;
  }

  setPatientId(patinetId: string){
    this.patientId = patinetId;
  }

  getPatientNationalId(): string | undefined{
    return this.patientNationalId;
  }

  setPatientNationalId(patientNationalId: string){
    this.patientNationalId = patientNationalId;
  }

  getPatientName(): string | undefined{
    return this.patientName;
  }

  setPatientName(patientName: string){
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

  
  constructor(private http: HttpClient, private sessionService: SessionService) {}

  // Use sessionStorage for persistence across navigation
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

  setEncounterInfo(data: { reasonToVisit: string, treatmentPlan: string, note: string }) {
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

  async endEncounter(): Promise<any> {
    try {
      this.setEncounterEndDate();

      const token = this.sessionService.getToken();
      const patientId = this.getPatientId();
      const hcpId = this.sessionService.getHealthcareProviderId();

      if (!token || !patientId || !hcpId) {
        throw new Error('Missing token, patientId, or hcpId');
      }

      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });

      const response = await this.http.post(
        `${BASE_URL}HealthCareProvider/EndEncounter/${patientId}/${hcpId}`,
        this.encounterSession,
        { headers }
      ).toPromise();

      // Clear all encounter-related data
      this.clearEncounterSession();
      
      return { success: true, data: response };
    } catch (error: any) {
      console.error('Error ending encounter:', error);
      return { success: false, error: error.message || 'Unknown error' };
    }
  }

  // Clear all encounter session data
  clearEncounterSession() {
    // Clear service state
    this.reset();
    
    // Clear sessionStorage
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

  resetSessionPatientData(){
    this.setPatientId('');
    this.setPatientName('');
    this.setPatientNationalId('');
  }

  // get encounter session data
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

  buildEncounterPayload(
    encounterInfo: any,
    prescriptions: any[],
    condition: any,
    observations: any[],
    labTest: any
  ): any {
    return {
      encounter: {
        startDate: this.encounterSession.encounter.startDate,
        endDate: new Date().toISOString(),
        reason_To_Visit: encounterInfo.reasonToVisit || '',
        treatment_Plan: encounterInfo.treatmentPlan || '',
        note: encounterInfo.note || ''
      },
      ...(prescriptions.length > 0 && {
        prescription: {
          prescriptionDate: new Date().toISOString(),
          medicines: prescriptions
        }
      }),
      ...(condition && { condition }),
      ...(observations.length > 0 && { observations }),
      ...(labTest && { labTests: labTest })
    };
  }
  
}
