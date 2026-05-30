import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import ApexCharts, { ApexOptions } from 'apexcharts';
import { loadImage } from '../../services/loadPicture';
import { SessionService } from '../../services/session.service';
import { DashboardService } from '../../core/api/dashboard.service';
import { ClinicDashboard } from '../../core/models/dashboard.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  dashboard?: ClinicDashboard;
  loading = true;
  error = '';

  @ViewChild('doctorImage') doctorImageRef!: ElementRef<HTMLImageElement>;

  constructor(
    private router: Router,
    private sessionService: SessionService,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    const hcpId = this.sessionService.getHealthcareProviderId() ?? '';

    this.dashboardService.getClinicDashboard(hcpId).subscribe({
      next: (res) => {
        this.dashboard = res;
        this.loading = false;
        this.sessionService.setSpecialization(res.specialization);

        setTimeout(() => {
          if (res.last7DaysEncounters?.length) {
            this.loadTotalPatientsPerDay();
          }
          if (res.frequentConditions?.length) {
            this.loadFrequentDiseases();
          }
          if (res.imageUrl && this.doctorImageRef) {
            loadImage(res.imageUrl, this.doctorImageRef.nativeElement);
          }
        });
      },
      error: () => {
        this.error = 'Unable to load dashboard data. Please try again.';
        this.loading = false;
      }
    });

    this.generateCalendar();
  }

  get recentEncounters() {
    return this.dashboard?.encounterSummaray ?? [];
  }

  // Charts
  loadTotalPatientsPerDay() {
    const options: ApexOptions = {
      chart: { type: 'bar', height: 250 },
      series: [{ name: 'Encounters', data: this.dashboard!.last7DaysEncounters }],
      xaxis: { categories: this.generateDayLabels() },
      yaxis: { title: { text: 'Number of Encounters' }, forceNiceScale: true },
      dataLabels: { enabled: false },
      colors: ['#0D9488']
    };

    const el = document.querySelector('#TotalPatientsPerDayChart') as HTMLElement | null;
    if (el) new ApexCharts(el, options).render();
  }

  generateDayLabels(): string[] {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const labels: string[] = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      labels.push(i === 0 ? 'Today' : days[date.getDay()]);
    }
    return labels;
  }

  loadFrequentDiseases() {
    const labels = this.dashboard!.frequentConditions.map(c => c.conditionName);
    const series = this.dashboard!.frequentConditions.map(c => c.frequency);

    const options: ApexOptions = {
      chart: { type: 'pie', width: '100%', height: 400 },
      labels,
      series,
      tooltip: { y: { formatter: (val: any) => `${val} cases` } },
      responsive: [
        {
          breakpoint: 1024,
          options: { chart: { width: '100%', height: 300 }, legend: { position: 'bottom' } }
        },
        {
          breakpoint: 640,
          options: { chart: { width: '100%', height: 250 }, legend: { position: 'bottom' } }
        }
      ]
    };

    const el = document.querySelector('#TopDiseasesChart') as HTMLElement | null;
    if (el) new ApexCharts(el, options).render();
  }

  // Calendar Logic
  currentDate = new Date();
  currentMonth = this.currentDate.getMonth();
  currentYear = this.currentDate.getFullYear();
  calendarDays: { date: number; isPrevOrNext: boolean; isToday: boolean }[] = [];

  monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  weekDays = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

  generateCalendar() {
    this.calendarDays = [];

    const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1);
    const startingDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7;
    const daysInCurrentMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(this.currentYear, this.currentMonth, 0).getDate();
    const today = new Date();

    for (let i = daysInPrevMonth - startingDayOfWeek + 1; i <= daysInPrevMonth; i++) {
      this.calendarDays.push({ date: i, isPrevOrNext: true, isToday: false });
    }

    for (let i = 1; i <= daysInCurrentMonth; i++) {
      const isToday =
        i === today.getDate() &&
        this.currentMonth === today.getMonth() &&
        this.currentYear === today.getFullYear();
      this.calendarDays.push({ date: i, isPrevOrNext: false, isToday });
    }

    const remaining = 42 - this.calendarDays.length;
    for (let i = 1; i <= remaining; i++) {
      this.calendarDays.push({ date: i, isPrevOrNext: true, isToday: false });
    }
  }

  previousMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear -= 1;
    } else {
      this.currentMonth -= 1;
    }
    this.generateCalendar();
  }

  nextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear += 1;
    } else {
      this.currentMonth += 1;
    }
    this.generateCalendar();
  }

  goToPatientHistory(patientId: string): void {
    this.router.navigate(['/patient-history', patientId]);
  }
}
