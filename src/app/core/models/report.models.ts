export interface TrafficReport {
  totalPatients: number;
  repeatVisitRate: number;
  averagePatientsPerMonth: number;
  totalEncounters: number;
  averageEncounterDurationInMinutes: number;
  mostCommonVisitReasons: string[];
  averageConditionsPerEncounter: number;
  severityDistribution: Record<string, unknown>;
  clinicalStatusDistribution: Record<string, unknown>;
  mostAffectedBodySites: Record<string, unknown>;
}
