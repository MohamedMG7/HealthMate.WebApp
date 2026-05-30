import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PatientHistoryService } from '../../core/api/patient-history.service';
import { EncounterHistoryItem } from '../../core/models/encounter.models';

@Component({
  selector: 'app-patient-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './patient-history.component.html',
  styleUrls: ['./patient-history.component.css']
})
export class PatientHistoryComponent implements OnInit {
  patientId = '';
  encounters: EncounterHistoryItem[] = [];
  hasMore = false;
  page = 1;
  loading = false;
  loadingMore = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private patientHistoryService: PatientHistoryService
  ) {}

  ngOnInit(): void {
    this.patientId = this.route.snapshot.paramMap.get('patientId') ?? '';
    this.loadEncounters();
  }

  loadEncounters(): void {
    this.loading = true;
    this.error = '';
    this.patientHistoryService.getEncounters(this.patientId, this.page).subscribe({
      next: (res) => {
        this.encounters = res.items;
        this.hasMore = res.hasMore;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load encounter history. Please try again.';
        this.loading = false;
      }
    });
  }

  loadMore(): void {
    this.loadingMore = true;
    this.page++;
    this.patientHistoryService.getEncounters(this.patientId, this.page).subscribe({
      next: (res) => {
        this.encounters = [...this.encounters, ...res.items];
        this.hasMore = res.hasMore;
        this.loadingMore = false;
      },
      error: () => {
        this.page--;
        this.loadingMore = false;
      }
    });
  }

  goToEncounterDetails(encounterId: number): void {
    this.router.navigate(['/encounter-details', encounterId]);
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  statusLabel(status: string | number): string {
    if (status === 'Active' || status === 0) return 'Active';
    if (status === 'Finished' || status === 1) return 'Finished';
    return String(status);
  }

  statusClass(status: string | number): string {
    return this.statusLabel(status) === 'Active'
      ? 'bg-green-100 text-green-700'
      : 'bg-gray-100 text-gray-600';
  }
}
