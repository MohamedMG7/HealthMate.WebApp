import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, concatMap, map, of } from 'rxjs';
import { BASE_URL } from '../../services/config';
import {
  EndEncounterRequest,
  FinalizeEncounterInput,
  RecordConditionRequest,
  StartEncounterRequest,
  StartEncounterResult,
  WritePrescriptionRequest,
} from '../models/encounter-lifecycle.models';

@Injectable({ providedIn: 'root' })
export class EncounterLifecycleService {

  constructor(private http: HttpClient) {}

  start(req: StartEncounterRequest): Observable<StartEncounterResult> {
    return this.http.post<StartEncounterResult>(`${BASE_URL}Encounter/start`, req);
  }

  recordCondition(encounterId: number, req: RecordConditionRequest): Observable<void> {
    return this.http.post<void>(`${BASE_URL}Encounter/${encounterId}/conditions`, req);
  }

  writePrescription(encounterId: number, req: WritePrescriptionRequest): Observable<void> {
    return this.http.post<void>(`${BASE_URL}Encounter/${encounterId}/prescription`, req);
  }

  end(encounterId: number, req: EndEncounterRequest): Observable<void> {
    return this.http.post<void>(`${BASE_URL}Encounter/${encounterId}/end`, req);
  }

  // Chains start → [condition] → [prescription] → end in order.
  // Condition and prescription steps are omitted when not provided.
  finalize(input: FinalizeEncounterInput): Observable<{ encounterId: number }> {
    return this.start(input.start).pipe(
      concatMap(({ encounterId }) => {
        const steps: Observable<unknown>[] = [];

        if (input.condition) {
          steps.push(this.recordCondition(encounterId, input.condition));
        }
        if (input.prescription) {
          steps.push(this.writePrescription(encounterId, input.prescription));
        }
        steps.push(this.end(encounterId, input.end));

        return steps
          .reduce(
            (chain, step) => chain.pipe(concatMap(() => step)),
            of(null as unknown),
          )
          .pipe(map(() => ({ encounterId })));
      }),
    );
  }
}
