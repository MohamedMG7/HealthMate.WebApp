export interface PatientGeneralInformation {
  name: string;
  gender: string;
  age: number;
  height: number;
  weight: number;
}

export interface BloodPressureData {
  isUpdated: boolean;
  averageSystolic: number;
  averageDiastolic: number;
}

export interface HeartRateData {
  isUpdated: boolean;
  average: number;
}

export interface GlucoseData {
  isUpdated: boolean;
  average: number;
}

export interface HemoglobinReading {
  date?: string;
  recordedDate?: string;
  hemoglobinValue?: number;
  value?: number;
  level?: number;
}

export interface HemoglobinData {
  hemoglobinReadings: HemoglobinReading[];
}

export interface MentalHealthStatus {
  mood: string;
  anxiety: string;
}

export interface PatientCondition {
  conditionCode: string;
  conditionName: string;
  conditionDate: string;
  treatement: string; // backend typo preserved
}

export interface PatientDocument {
  path: string;
  name: string;
  recordedTime: string;
}

export interface AppointmentHistoryItem {
  encounterId: number;
  hcpName: string;
  hcpSpecialization: string;
  encounterDate: string;
}

export interface StartEncounterResponse {
  patientId: string;
  patientImageUrl: string;
  patientGeneralInformation: PatientGeneralInformation;
  bloodPressure: BloodPressureData;
  heartRate: HeartRateData;
  glucose: GlucoseData;
  hemoglobin: HemoglobinData;
  mentalHealthStatus: MentalHealthStatus;
  condition: PatientCondition;
  documents: PatientDocument[];
  appointmentHisory: AppointmentHistoryItem[]; // backend typo preserved
}
