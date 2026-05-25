import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { BASE_URL } from '../../services/config';
import { loadImage } from '../../services/loadPicture';
import { EncounterSessionService } from '../../services/encounter-session.service';
import ApexCharts, { ApexOptions } from 'apexcharts';
import { SessionService } from '../../services/session.service';
import { PopupMessageService } from '../../services/popup-message.service';



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
  @ViewChild('chatTextarea') chatTextarea!: ElementRef;
  

  showPopup = false;
  patientId = '';
  patientData: any = null;
  profileImage: string = 'assets/images/default.png';
  documents: any[] = [];
  appointmentHistory: any[] = [];
  chatbotReferences: string[] = [];
  token: string = '';
  errorMessage = '';
  private chart: any = null;
  private chartDataReady = false;

  constructor(
    private http: HttpClient,
    private encounterService: EncounterSessionService,
    private sessionService: SessionService,
    private router: Router,
    private popupService: PopupMessageService,
    
  ) {
    this.token = this.sessionService.getToken() || '';
  }

  ngOnInit(): void {
    this.initializeComponent();
    //this.setupEndEncounterButton();
    this.loadChatbotReferences();
  }
  goToEncounterDetails(encounterId: number): void {
    this.router.navigate(['/encounter-details', encounterId]);
  }
  ngAfterViewInit(): void {
    // If data is ready but chart hasn't been rendered yet, render it now
    if (this.chartDataReady && this.patientData) {
      setTimeout(() => {
        this.renderHemoglobinChart(this.patientData.hemoglobin?.hemoglobinReadings || []);
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
        this.populatePatientData(cached, PatientNationalId);
        this.showPopup = false;
      } else {
        this.fetchPatientData(PatientNationalId);
      }
    }
  }

  // private setupEndEncounterButton(): void {
  //   setTimeout(() => {
  //     const endBtn = document.getElementById('endEncounterBtn');
  //     if (endBtn) {
  //       endBtn.addEventListener('click', this.handleEndEncounter.bind(this));
  //     }
  //   }, 100);
  // }
  goToEncounterConfirmation(): void {
    this.router.navigate(['/encounter-confirmation']);
  }

  private async handleEndEncounter(): Promise<void> {
    try {
      const result = await this.encounterService.endEncounter();

      if (result.success) {
        this.popupService.showSuccess('Encounter ended successfully!');
        this.resetComponentState();
        this.showPopup = true;
      } else {
        alert('Failed to end encounter: ' + result.error);
      }
    } catch (error) {
      console.error('Error in handleEndEncounter:', error);
      this.popupService.showFailure('An error occurred while ending the encounter');
    }
  }

  private resetComponentState(): void {
    this.patientData = null;
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
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${this.token}`
    });

    this.http.get(`${BASE_URL}HealthCareProvider/StartEncounter?patientNationalId=${patientNationalId}`, { headers })
      .subscribe({
        next: (data: any) => {
          //console.log('Patient data received:', data); // Debug log
          this.encounterService.setCachedPatientData(data);
          this.populatePatientData(data, patientNationalId);
          this.showPopup = false;
        },
        error: (error) => {
          //console.error('Error fetching patient data:', error);
          this.patientId = '';
          this.errorMessage = 'Invalid Patient ID';
        }
      });
  }

  private populatePatientData(data: any, patientNationalId: string) {
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

    // Debug hemoglobin data
    //console.log('Hemoglobin data:', data.hemoglobin);
    
    // Try multiple timeouts to ensure the view is ready
    this.attemptChartRender(data.hemoglobin?.hemoglobinReadings || []);
  }

  private attemptChartRender(readings: any[], attempts: number = 0): void {
    const maxAttempts = 5;
    
    if (attempts >= maxAttempts) {
      //console.error('Failed to render chart after maximum attempts');
      return;
    }

    setTimeout(() => {
      if (this.areaChartRef?.nativeElement) {
        this.renderHemoglobinChart(readings);
      } else {
        //console.log(`Chart element not ready, attempt ${attempts + 1}/${maxAttempts}`);
        this.attemptChartRender(readings, attempts + 1);
      }
    }, 100 * (attempts + 1)); // Increasing delay
  }

  renderHemoglobinChart(readings: any[]): void {
    //console.log('Attempting to render chart with readings:', readings);
    
    // Destroy existing chart
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }

    // Check if element exists
    if (!this.areaChartRef?.nativeElement) {
      console.error('Chart container element not found');
      return;
    }

    // Handle empty data - show empty chart instead of text message
    const hasData = readings && Array.isArray(readings) && readings.length > 0;
    
    if (!hasData) {
      console.warn('No hemoglobin readings available - showing empty chart');
    }

    try {
      // Prepare data
      let categories: string[] = [];
      let seriesData: number[] = [];
      
      if (hasData) {
        categories = readings.map(r => {
          // Handle different date formats
          if (r.date) {
            return new Date(r.date).toLocaleDateString();
          }
          return r.recordedDate ? new Date(r.recordedDate).toLocaleDateString() : 'Unknown';
        });
        
        seriesData = readings.map(r => {
          const value = r.hemoglobinValue || r.value || r.level || 0;
          return parseFloat(value) || 0;
        });
      } else {
        // Show empty chart with placeholder data
        const today = new Date();
        categories = Array.from({length: 7}, (_, i) => {
          const date = new Date(today);
          date.setDate(date.getDate() - (6 - i));
          return date.toLocaleDateString();
        });
        seriesData = new Array(7).fill(null); // null values won't be plotted
      }

      // Calculate appropriate Y-axis range
      const validData = seriesData.filter(val => val !== null && val !== undefined);
      const minValue = validData.length > 0 ? Math.min(...validData) : 0;
      const maxValue = validData.length > 0 ? Math.max(...validData) : 20; // Default max for hemoglobin
      const padding = validData.length > 0 ? (maxValue - minValue) * 0.1 || 1 : 2;

      const options: ApexOptions = {
        series: [{ 
          name: 'Hemoglobin', 
          data: seriesData 
        }],
        chart: { 
          type: 'area', 
          height: 200, 
          toolbar: { show: false },
          animations: {
            enabled: true,
            speed: 800
          }
        },
        dataLabels: { enabled: false },
        stroke: { 
          curve: 'smooth', 
          width: 2, 
          colors: ['#179898'] 
        },
        xaxis: {
          categories,
          labels: { 
            style: { colors: 'rgba(197, 197, 197, 1)' },
            rotate: -45
          }
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
            style: {
              color: 'rgba(197, 197, 197, 1)',
              fontSize: '12px'
            }
          }
        },
        colors: ['#179898'],
        fill: {
          type: 'solid',
          colors: ['rgba(97, 196, 233, 0.65)']
        },
        tooltip: {
          y: { 
            formatter: (val: number) => val !== null ? `${val.toFixed(1)} g/dL` : 'No data'
          }
        },
        grid: {
          borderColor: '#e7e7e7',
          strokeDashArray: 5,
        },
        noData: {
          text: hasData ? undefined : 'No hemoglobin data available for the last 30 days',
          align: 'center',
          verticalAlign: 'middle',
          offsetX: 0,
          offsetY: 0,
          style: {
            color: 'rgba(197, 197, 197, 1)',
            fontSize: '14px',
            fontFamily: undefined
          }
        }
      };

      // Create and render chart
      this.chart = new ApexCharts(this.areaChartRef.nativeElement, options);
      this.chart.render().then(() => {
        //console.log('Chart rendered successfully');
      }).catch((error: any) => {
        console.error('Error rendering chart:', error);
      });

    } catch (error) {
      console.error('Error in renderHemoglobinChart:', error);
      this.areaChartRef.nativeElement.innerHTML = '<div class="text-center text-red-500 py-8">Error loading chart</div>';
    }
  }
  
  openDocument(doc: { path: string; name: string }): void {
  const encodedPath = encodeURIComponent(doc.path);
  const encodedName = encodeURIComponent(doc.name);
  const viewerUrl = `/document-viewer?path=${encodedPath}&name=${encodedName}`;
  window.open(viewerUrl, '_blank');
}

  shouldShowNotUpdated(field: { isUpdated: boolean }): boolean {
    return field?.isUpdated === false;
  }

  // isAbnormal(field: { isNormal: boolean }): boolean {
  //   return field?.isNormal === false;
  // }


  ///////////////////////CHATBOT/////////////////
  chatbotOpen = false;
  chatPrompt = '';
  chatbotResponse = '';
  isLoading = false;
  
  // Autocomplete properties
  showSuggestions = false;
  filteredSuggestions: string[] = [];
  selectedSuggestionIndex = -1;
  atSymbolPosition = -1;

  toggleChatbot(): void {
    this.chatbotOpen = !this.chatbotOpen;
    this.chatbotResponse = '';
    this.chatPrompt = '';
    this.hideSuggestions();
  
    // 👉 Load references again when opening, in case they weren’t loaded yet
    if (this.chatbotOpen && this.chatbotReferences.length === 0) {
      this.loadChatbotReferences();
    }
  }

  onTextareaInput(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    const value = textarea.value;
    const cursorPosition = textarea.selectionStart || 0;
    
    this.chatPrompt = value;
    this.handleAutocomplete(value, cursorPosition);
  }

  onTextareaKeydown(event: KeyboardEvent): void {
    if (!this.showSuggestions) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.selectedSuggestionIndex = Math.min(
          this.selectedSuggestionIndex + 1,
          this.filteredSuggestions.length - 1
        );
        break;
      
      case 'ArrowUp':
        event.preventDefault();
        this.selectedSuggestionIndex = Math.max(this.selectedSuggestionIndex - 1, 0);
        break;
      
      case 'Enter':
      case 'Tab':
        if (this.selectedSuggestionIndex >= 0) {
          event.preventDefault();
          this.selectSuggestion(this.filteredSuggestions[this.selectedSuggestionIndex]);
        }
        break;
      
      case 'Escape':
        this.hideSuggestions();
        break;
    }
  }

  private handleAutocomplete(value: string, cursorPosition: number): void {
    // Find the last @ symbol before the cursor
    const textBeforeCursor = value.substring(0, cursorPosition);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');
    
    if (lastAtIndex === -1) {
      this.hideSuggestions();
      return;
    }

    // Check if there's a space between @ and cursor (which would end the autocomplete)
    const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1);
    if (textAfterAt.includes(' ')) {
      this.hideSuggestions();
      return;
    }

    // Show suggestions
    this.atSymbolPosition = lastAtIndex;
    const searchTerm = textAfterAt.toLowerCase();
    
    this.filteredSuggestions = this.chatbotReferences.filter(ref => 
      ref.toLowerCase().includes(searchTerm)
    );
    
    this.showSuggestions = this.filteredSuggestions.length > 0;
    this.selectedSuggestionIndex = 0;
  }

  selectSuggestion(suggestion: string): void {
    const textarea = this.chatTextarea.nativeElement;
    const cursorPosition = textarea.selectionStart || 0;
    const textBeforeCursor = this.chatPrompt.substring(0, cursorPosition);
    const textAfterCursor = this.chatPrompt.substring(cursorPosition);
    
    // Find the @ symbol position
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');
    if (lastAtIndex === -1) return;
    
    // Replace from @ to cursor with the suggestion
    const newValue = 
      this.chatPrompt.substring(0, lastAtIndex) + 
      suggestion + 
      ' ' + 
      textAfterCursor;
    
    this.chatPrompt = newValue;
    
    // Set cursor position after the inserted suggestion
    setTimeout(() => {
      const newCursorPosition = lastAtIndex + suggestion.length + 1;
      textarea.setSelectionRange(newCursorPosition, newCursorPosition);
      textarea.focus();
    });
    
    this.hideSuggestions();
  }

  private hideSuggestions(): void {
    this.showSuggestions = false;
    this.filteredSuggestions = [];
    this.selectedSuggestionIndex = -1;
    this.atSymbolPosition = -1;
  }

  sendPrompt(event: Event): void {
    event.preventDefault();
    if (!this.chatPrompt.trim()) return;
  
    this.hideSuggestions(); // Hide suggestions when sending
    this.isLoading = true;
    this.chatbotResponse = '';
  
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token}`
    });
  
    const patientId = this.encounterService.getPatientId();
    if (!patientId) {
      this.chatbotResponse = 'Error: Patient is not selected.';
      this.isLoading = false;
      return;
    }
  
    const body = {
      prompt: this.chatPrompt.trim()
    };
  
    const url = `${BASE_URL}Sina/ask-with-mcp?patientId=${patientId}`;
  
    this.http.post<{ reply: string }>(url, body, { headers }).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.typeResponse(response.reply);
      },
      error: (err) => {
        console.error('Chatbot error:', err);
        this.chatbotResponse = 'Error: could not reach Sina.';
        this.isLoading = false;
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
    }, 5); // Typing speed
  }
  
  private scrollToBottom(): void {
    try {
      const el = this.chatScrollContainer?.nativeElement;
      el.scrollTop = el.scrollHeight;
    } catch (err) {
      console.warn('Auto-scroll failed:', err);
    }
  }

  loadChatbotReferences(): void {
    const cached = this.encounterService.getChatbotReferences();
    if (cached) {
      this.chatbotReferences = cached;
      return;
    }
  
    const patientId = this.encounterService.getPatientId();
    if (!patientId) return;
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Accept': 'application/json'
    });
  
    this.http.get<any>(`${BASE_URL}Sina/references/${patientId}`, { headers }).subscribe({
      next: (data) => {
        // Fixed the prefixes to match your backend expectations
        const prescriptions = data.prescriptions?.map((id: string) => `@Prescription-${id}`) || [];
        const observations = data.observations?.map((id: string) => `@Observation-${id}`) || [];
        const labTests = data.labTests?.map((id: string) => `@LabTest-${id}`) || [];
  
        const allRefs = [...prescriptions, ...observations, ...labTests];
        this.chatbotReferences = allRefs;
        this.encounterService.setChatbotReferences(allRefs);
      },
      error: (err) => {
        console.error('Failed to load chatbot references', err);
      }
    });
  }
  
}
