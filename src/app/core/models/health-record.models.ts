export interface ConditionSummary {
  conditionId: number;
  conditionName: string;
  date: string;
  severity: string;
  note: string;
}

export interface LabTestSummary {
  labTestId: number;
  testName: string;
  testDate: string;
  result: string;
  note: string;
}

export interface MedicalImageSummary {
  medicalImageId: number;
  medicalImageName: string;
  medicalImageDate: string;
}

export interface MedicineSummary {
  patientMedicineId: number;
  name: string;
  date: string;
  dosePerTime: string;
  durationInDays: number;
  frequencyInHours: number;
  isOngoing: boolean;
}

export interface PrescriptionSummary {
  prescriptionId: number;
  prescriptionDate: string;
  publisher: string;
  conditionName: string;
}

export interface EncounterSummary {
  encounterId: number;
  conditionName: string;
  encounterDate: string;
}

export interface HealthRecordSummary {
  conditionsSummary: ConditionSummary[];
  labTestsSummary: LabTestSummary[];
  medicalImagesSummary: MedicalImageSummary[];
  medicinesSummary: MedicineSummary[];
  prescriptionsSummary: PrescriptionSummary[];
  encountersSummary: EncounterSummary[];
}
