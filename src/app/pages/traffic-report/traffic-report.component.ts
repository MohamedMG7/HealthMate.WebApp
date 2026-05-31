import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../services/session.service';
import { ReporterService } from '../../core/api/reporter.service';
import { TrafficReport } from '../../core/models/report.models';

@Component({
  selector: 'app-traffic-report',
  standalone: true,
  imports: [],
  templateUrl: './traffic-report.component.html',
  styleUrls: ['./traffic-report.component.css']
})
export class TrafficReportComponent implements OnInit {
  report: TrafficReport | null = null;
  loading = false;
  error = '';

  constructor(
    private sessionService: SessionService,
    private reporterService: ReporterService
  ) {}

  ngOnInit(): void {
    const providerId = this.sessionService.getHealthcareProviderId();
    if (!providerId) {
      this.error = 'Provider ID not found. Please log in again.';
      return;
    }
    this.loading = true;
    this.error = '';
    this.reporterService.getTrafficReport(providerId).subscribe({
      next: (data) => {
        this.report = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load traffic report. Please try again.';
        this.loading = false;
      }
    });
  }

  getEntries(obj: Record<string, unknown>): [string, unknown][] {
    return Object.entries(obj);
  }
}
