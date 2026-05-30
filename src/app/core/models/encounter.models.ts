export type EncounterStatus = 'Active' | 'Finished' | string | number;

export interface EncounterHistoryItem {
  encounterId: number;
  startDate: string;
  endDate: string | null;
  status: EncounterStatus;
  reasonToVisit: string;
  healthCareProviderId: string;
}

export interface EncounterHistoryPage {
  items: EncounterHistoryItem[];
  page: number;
  pageSize: number;
  hasMore: boolean;
}
