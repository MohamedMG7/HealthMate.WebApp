import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import ApexCharts, { ApexOptions } from 'apexcharts';
import { BASE_URL } from '../../services/config';
import { loadImage } from '../../services/loadPicture';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  username = '';
  email = '';
  data: any;

  @ViewChild('doctorImage') doctorImageRef!: ElementRef<HTMLImageElement>;

  constructor(private http: HttpClient, private router: Router,private sessionService: SessionService) {}

  ngOnInit(): void {
    const token = this.sessionService.getToken();
    const Id = this.sessionService.getHealthcareProviderId();

    const headers = { Authorization: `Bearer ${token}` };

    this.http.get(`${BASE_URL}HealthCareProvider/ClinicDashboard?HealthCareProviderId=${Id}`, { headers }).subscribe({
      next: (res: any) => {
        console.log('Data received:', res);
        this.data = res;

        //this.sessionService.setUsername(res.name); moved to login
        this.sessionService.setSpecialization(res.specialization);
        this.username = res.name;
        //this.email = sessionStorage.getItem('hcpMail') || '';

        this.loadTotalPatientsPerDay();
        this.loadFrequentDiseases();

        if (res.imageUrl && this.doctorImageRef) {
          loadImage(res.imageUrl, this.doctorImageRef.nativeElement);
        }
      },
      error: err => console.error('Fetch error:', err)
    });

    this.generateCalendar();
  }

  // Charts
  loadTotalPatientsPerDay() {
    const options: ApexOptions = {
      chart: { type: 'bar', height: 250 },
      series: [{ name: 'Encounters', data: this.data.last7DaysEncounters }],
      xaxis: { categories: this.generateDayLabels() },
      yaxis: { title: { text: 'Number of Encounters' }, forceNiceScale: true },
      dataLabels: { enabled: false },
      colors: ['#0D9488']
    };

    const chart = new ApexCharts(document.querySelector('#TotalPatientsPerDayChart')!, options);
    chart.render();
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
    const labels = this.data.frequentConditions.map((c: any) => c.conditionName);
    const series = this.data.frequentConditions.map((c: any) => c.frequency);
  
    const options: ApexOptions = {
      chart: {
        type: 'pie',
        width: '100%',
        height: 400,
      },
      labels,
      series,
      tooltip: {
        y: {
          formatter: (val: any) => `${val} cases`
        }
      },
      responsive: [
        {
          breakpoint: 1024,
          options: {
            chart: {
              width: '100%',
              height: 300
            },
            legend: {
              position: 'bottom'
            }
          }
        },
        {
          breakpoint: 640,
          options: {
            chart: {
              width: '100%',
              height: 250
            },
            legend: {
              position: 'bottom'
            }
          }
        }
      ]
    };
  
    const chart = new ApexCharts(document.querySelector('#TopDiseasesChart')!, options);
    chart.render();
  }
  

  // 📅 Calendar Logic
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
    const startingDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7; // Start week on Saturday
    const daysInCurrentMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(this.currentYear, this.currentMonth, 0).getDate();
    const today = new Date();

    // Previous month filler days
    for (let i = daysInPrevMonth - startingDayOfWeek + 1; i <= daysInPrevMonth; i++) {
      this.calendarDays.push({ date: i, isPrevOrNext: true, isToday: false });
    }

    // Current month days
    for (let i = 1; i <= daysInCurrentMonth; i++) {
      const isToday =
        i === today.getDate() &&
        this.currentMonth === today.getMonth() &&
        this.currentYear === today.getFullYear();

      this.calendarDays.push({ date: i, isPrevOrNext: false, isToday });
    }

    // Next month filler days to make 42 total (6 weeks view)
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

  goToEncounterSummary(encounterId: number): void {
  this.router.navigate(['/encounter-details', encounterId]);
  }
}
