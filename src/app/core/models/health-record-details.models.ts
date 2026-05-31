export interface LabTestResult { attributeName: string; value: number; }
export interface LabTestDetails { patientName: string; patientNationalId: string; labTestName: string; labTestDate: string; labTestImageUrl?: string; results: LabTestResult[]; }
export interface MedicalImageDetails { patientNationalId: string; patientName: string; medicalImageName: string; date?: string; imageUrl?: string; interpretation: string; }
export interface MedicineDetails { name: string; dose: string; frequencyInHours: number; durationInDays: number; }
export interface PrescriptionDetails { patientName: string; patientNationalId: string; prescriptionDate: string; diseaseName: string; medicines: MedicineDetails[]; }
export interface ConditionDetails { diseaseName: string; paientId: number; dateRecorded: string; clinicalStatus: string; recorder: string; severity: string; note?: string; }
export interface EncounterDetails { patientNationalId: string; patientName: string; healthCareProviderName: string; date: string; reason_To_Visit: string; treatment_Plan: string; note: string; conditions: ConditionDetails[]; prescription: MedicineDetails[]; }
