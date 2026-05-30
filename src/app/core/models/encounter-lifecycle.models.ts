export interface StartEncounterRequest {
  patientId: number;
  healthCareProviderId: number;
  reasonToVisit: string;
}

export interface StartEncounterResult {
  encounterId: number;
}

export interface RecordConditionRequest {
  diseaseId: number;
  severity: number;
  clinicalStatus: number;
  dateRecorded: string;
  note?: string;
}

export interface WritePrescriptionMedicine {
  medicineId: number;
  dosage: string;
  frequencyInHours: number;
  durationInDays: number;
}

export interface WritePrescriptionRequest {
  publisher: string | null;
  medicines: WritePrescriptionMedicine[];
}

export interface EndEncounterRequest {
  treatmentPlan: string;
  note?: string;
}

export interface FinalizeEncounterInput {
  start: StartEncounterRequest;
  condition?: RecordConditionRequest;
  prescription?: WritePrescriptionRequest;
  end: EndEncounterRequest;
}
