export interface EncounterTableSummary {
  encounterId: number;
  patient_Name: string;
  patient_Id: string;
  encounterDate: string;
  diagnosis: string;
}

export interface ConditionFrequency {
  conditionName: string;
  frequency: number;
}

export interface ClinicDashboard {
  name: string;
  specialization: string;
  imageUrl: string;
  totalEncounters: number;
  totalEncountersToday: number;
  totalPatients: number;
  totalOfUnreadMessages: number;
  last7DaysEncounters: number[];
  encounterSummaray: EncounterTableSummary[]; // backend typo preserved
  frequentConditions: ConditionFrequency[];
}
