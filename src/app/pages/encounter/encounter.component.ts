import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BASE_URL } from '../../services/config';
import { EncounterSessionService } from '../../services/encounter-session.service';
import ApexCharts, { ApexOptions } from 'apexcharts';
import { PopupMessageService } from '../../services/popup-message.service';
import { EncounterApiService } from '../../core/api/encounter.service';
import { SinaService } from '../../core/api/sina.service';
import { StartEncounterResponse, PatientDocument, AppointmentHistoryItem, HemoglobinReading } from '../../core/models/encounter-workspace.models';

@Component({
  selector: 'app-encounter',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './encounter.component.html',
  styleUrls: ['./encounter.component.css']
})
export class EncounterComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('areaChartRef', { static: false }) areaChartRef!: ElementRef;
  @ViewChild('chatScrollContainer') chatScrollContainer!: ElementRef;

  showPopup = false;
  patientId = '';
  patientData?: StartEncounterResponse;
  profileImage: string = 'assets/images/default.png';
  documents: PatientDocument[] = [];
  appointmentHistory: AppointmentHistoryItem[] = [];
  errorMessage = '';
  private chart: any = null;
  private chartDataReady = false;

  constructor(
    private encounterService: EncounterSessionService,
    private encounterApiService: EncounterApiService,
    private sinaService: SinaService,
    private router: Router,
    private popupService: PopupMessageService,
  ) {}

  ngOnInit(): void {
    this.initializeComponent();
  }

  goToEncounterDetails(encounterId: number): void {
    this.router.navigate(['/encounter-details', encounterId]);
  }

  ngAfterViewInit(): void {
    if (this.chartDataReady && this.patientData) {
      setTimeout(() => {
        this.renderHemoglobinChart(this.patientData!.hemoglobin?.hemoglobinReadings || []);
      }, 100);
    }
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }

  private initializeComponent(): void {
    const overlayShown = this.encounterService.getOverlayShown();
    const PatientNationalId = this.encounterService.getPatientNationalId();

    if (!overlayShown || !PatientNationalId) {
      this.showPopup = true;
    } else {
      const cached = this.encounterService.getCachedPatientData();
      if (cached) {
        this.populatePatientData(cached as StartEncounterResponse, PatientNationalId);
        this.showPopup = false;
      } else {
        this.fetchPatientData(PatientNationalId);
      }
    }
  }

  goToEncounterConfirmation(): void {
    this.router.navigate(['/encounter-confirmation']);
  }

  private resetComponentState(): void {
    this.patientData = undefined;
    this.patientId = '';
    this.profileImage = 'assets/images/default.png';
    this.documents = [];
    this.appointmentHistory = [];
    this.errorMessage = '';
    this.chartDataReady = false;

    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }

  onSearchSubmit(): void {
    const value = this.patientId.trim();
    if (!value) {
      this.errorMessage = 'Please enter a Patient ID';
      return;
    }
    this.errorMessage = '';
    this.encounterService.setOverlayShown(true);
    this.encounterService.setPatientNationalId(value);
    this.fetchPatientData(value);
  }

  clearError(): void {
    this.errorMessage = '';
  }

  fetchPatientData(patientNationalId: string): void {
    this.encounterApiService.startEncounter(patientNationalId).subscribe({
      next: (data) => {
        this.encounterService.setCachedPatientData(data);
        this.populatePatientData(data, patientNationalId);
        this.showPopup = false;
      },
      error: () => {
        this.patientId = '';
        this.errorMessage = 'Invalid Patient ID';
      }
    });
  }

  private populatePatientData(data: StartEncounterResponse, patientNationalId: string) {
    this.patientData = data;
    this.chartDataReady = true;

    this.encounterService.setPatientId(data.patientId);
    this.encounterService.setPatientNationalId(patientNationalId);
    this.encounterService.setPatientName(data.patientGeneralInformation?.name || 'Unknown');
    this.encounterService.setEncounterStartDate();
    this.encounterService.setEncounterInfo({
      reasonToVisit: 'Initial evaluation',
      treatmentPlan: 'To be defined',
      note: 'Started from Angular encounter page'
    });

    if (data.patientImageUrl) {
      this.profileImage = `${BASE_URL}Document/download-file?filePath=${encodeURIComponent(data.patientImageUrl)}`;
    }

    this.documents = Array.isArray(data.documents) ? data.documents : [];
    this.appointmentHistory = Array.isArray(data.appointmentHisory) ? data.appointmentHisory : [];

    this.attemptChartRender(data.hemoglobin?.hemoglobinReadings || []);
  }

  private attemptChartRender(readings: HemoglobinReading[], attempts: number = 0): void {
    const maxAttempts = 5;
    if (attempts >= maxAttempts) return;

    setTimeout(() => {
      if (this.areaChartRef?.nativeElement) {
        this.renderHemoglobinChart(readings);
      } else {
        this.attemptChartRender(readings, attempts + 1);
      }
    }, 100 * (attempts + 1));
  }

  renderHemoglobinChart(readings: HemoglobinReading[]): void {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }

    if (!this.areaChartRef?.nativeElement) {
      console.error('Chart container element not found');
      return;
    }

    const hasData = readings && Array.isArray(readings) && readings.length > 0;

    try {
      let categories: string[] = [];
      let seriesData: (number | null)[] = [];

      if (hasData) {
        categories = readings.map(r => {
          if (r.date) return new Date(r.date).toLocaleDateString();
          return r.recordedDate ? new Date(r.recordedDate).toLocaleDateString() : 'Unknown';
        });
        seriesData = readings.map(r => parseFloat(String(r.hemoglobinValue ?? r.value ?? r.level ?? 0)) || 0);
      } else {
        const today = new Date();
        categories = Array.from({ length: 7 }, (_, i) => {
          const date = new Date(today);
          date.setDate(date.getDate() - (6 - i));
          return date.toLocaleDateString();
        });
        seriesData = new Array(7).fill(null);
      }

      const validData = seriesData.filter((val): val is number => val !== null);
      const minValue = validData.length > 0 ? Math.min(...validData) : 0;
      const maxValue = validData.length > 0 ? Math.max(...validData) : 20;
      const padding = validData.length > 0 ? (maxValue - minValue) * 0.1 || 1 : 2;

      const options: ApexOptions = {
        series: [{ name: 'Hemoglobin', data: seriesData as number[] }],
        chart: {
          type: 'area',
          height: 200,
          toolbar: { show: false },
          animations: { enabled: true, speed: 800 }
        },
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth', width: 2, colors: ['#179898'] },
        xaxis: {
          categories,
          labels: { style: { colors: 'rgba(197, 197, 197, 1)' }, rotate: -45 }
        },
        yaxis: {
          min: Math.max(0, minValue - padding),
          max: maxValue + padding,
          tickAmount: 4,
          labels: {
            formatter: (val: number) => val.toFixed(1),
            style: { colors: 'rgba(197, 197, 197, 1)' }
          },
          title: {
            text: 'Hemoglobin (g/dL)',
            style: { color: 'rgba(197, 197, 197, 1)', fontSize: '12px' }
          }
        },
        colors: ['#179898'],
        fill: { type: 'solid', colors: ['rgba(97, 196, 233, 0.65)'] },
        tooltip: { y: { formatter: (val: number) => val !== null ? `${val.toFixed(1)} g/dL` : 'No data' } },
        grid: { borderColor: '#e7e7e7', strokeDashArray: 5 },
        noData: {
          text: hasData ? undefined : 'No hemoglobin data available for the last 30 days',
          align: 'center',
          verticalAlign: 'middle',
          style: { color: 'rgba(197, 197, 197, 1)', fontSize: '14px' }
        }
      };

      this.chart = new ApexCharts(this.areaChartRef.nativeElement, options);
      this.chart.render().catch((error: any) => {
        console.error('Error rendering chart:', error);
      });
    } catch (error) {
      console.error('Error in renderHemoglobinChart:', error);
      this.areaChartRef.nativeElement.innerHTML = '<div class="text-center text-red-500 py-8">Error loading chart</div>';
    }
  }

  openDocument(doc: PatientDocument): void {
    const encodedPath = encodeURIComponent(doc.path);
    const encodedName = encodeURIComponent(doc.name);
    window.open(`/document-viewer?path=${encodedPath}&name=${encodedName}`, '_blank');
  }

  shouldShowNotUpdated(field: { isUpdated: boolean } | undefined): boolean {
    return field?.isUpdated === false;
  }

  ///////////////////////CHATBOT/////////////////
  chatbotOpen = false;
  chatPrompt = '';
  chatbotResponse = '';
  chatbotAlerts: string[] = [];
  private sinaSessionId: string | null = null;
  isLoading = false;

  toggleChatbot(): void {
    this.chatbotOpen = !this.chatbotOpen;
    this.chatbotResponse = '';
    this.chatPrompt = '';

    if (this.chatbotOpen && !this.sinaSessionId) {
      this.openSinaSession();
    }
  }

  sendPrompt(event: Event): void {
    event.preventDefault();
    const content = this.chatPrompt.trim();
    if (!content) return;

    this.isLoading = true;
    this.chatbotResponse = '';

    const patientId = this.encounterService.getPatientId();
    if (!patientId) {
      this.chatbotResponse = 'Error: Patient is not selected.';
      this.isLoading = false;
      return;
    }

    const sendMessage = () => {
      this.sinaService.sendMessage(this.sinaSessionId!, content).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.chatPrompt = '';
          this.typeResponse(response.reply);
        },
        error: () => {
          this.chatbotResponse = 'Error: could not reach Sina.';
          this.isLoading = false;
        }
      });
    };

    if (!this.sinaSessionId) {
      this.sinaService.openSession(patientId).subscribe({
        next: (response) => {
          this.sinaSessionId = response.sessionId;
          this.chatbotAlerts = response.alerts?.map(a => a.message) || [];
          sendMessage();
        },
        error: () => {
          this.chatbotResponse = 'Error: could not start Sina session.';
          this.isLoading = false;
        }
      });
      return;
    }

    sendMessage();
  }

  private openSinaSession(): void {
    const patientId = this.encounterService.getPatientId();
    if (!patientId) return;

    this.sinaService.openSession(patientId).subscribe({
      next: (response) => {
        this.sinaSessionId = response.sessionId;
        this.chatbotAlerts = response.alerts?.map(a => a.message) || [];
      },
      error: () => {
        this.chatbotResponse = 'Error: could not start Sina session.';
      }
    });
  }

  typeResponse(text: string): void {
    this.chatbotResponse = '';
    let index = 0;

    const interval = setInterval(() => {
      if (index < text.length) {
        this.chatbotResponse += text[index];
        index++;
        this.scrollToBottom();
      } else {
        clearInterval(interval);
      }
    }, 5);
  }

  private scrollToBottom(): void {
    try {
      const el = this.chatScrollContainer?.nativeElement;
      el.scrollTop = el.scrollHeight;
    } catch (err) {
      console.warn('Auto-scroll failed:', err);
    }
  }
}
