import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { EncounterComponent } from './pages/encounter/encounter.component';
import { MessagesComponent } from './pages/messages/messages.component';
import { PolicyComponent } from './pages/policy/policy.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { HealthRecordComponent } from './pages/health-record/health-record.component';
import { LabtestDetailsComponent } from './pages/labtest-details/labtest-details.component';
import { MedicalImageDetailsComponent } from './pages/medical-image-details/medical-image-details.component';
import { authGuard } from './services/auth.guard';
import { PrescriptionDetailsComponent } from './pages/prescription-details/prescription-details.component';
import { ConditionAddComponent } from './pages/condition-add/condition-add.component';
import { PrescriptionAddComponent } from './pages/prescription-add/prescription-add.component';
import { TrafficReportComponent } from './pages/traffic-report/traffic-report.component';
import { MessageComposeComponent } from './pages/message-compose/message-compose.component';
import { MessageDetailsComponent } from './pages/message-details/message-details.component';
import { EncounterDetailsComponent } from './pages/encounter-details/encounter-details.component';
import { EncounterConfirmationComponent } from './pages/encounter-confirmation/encounter-confirmation.component';


export const routes: Routes = [
  // Redirect empty path to /login
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Login route
  { path: 'login', component: LoginComponent },

  {
    path: 'document-viewer',
    loadComponent: () =>
      import('./pages/document-viewer/document-viewer.component').then(
        (m) => m.DocumentViewerComponent
      )
  },

  // Protected layout with children (dashboard, encounter)
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'encounter', component: EncounterComponent },
      { path:'messages', component:MessagesComponent },
      { path:'reports', component:ReportsComponent },
      { path:'settings', component:SettingsComponent },
      { path:'policy', component:PolicyComponent },
      { path:'healthrecord', component:HealthRecordComponent },
      { path:'labtest-details/:id', component:LabtestDetailsComponent},
      { path:'medical-image-details/:id', component:MedicalImageDetailsComponent},
      { path:'prescription-details/:id', component:PrescriptionDetailsComponent},
      { path: 'condition-add', component: ConditionAddComponent },
      { path: 'prescription-add', component: PrescriptionAddComponent},
      { path: 'traffic-report', component: TrafficReportComponent},
      { path: 'settings', component:SettingsComponent},
      { path: 'message-compose', component:MessageComposeComponent},
      { path: 'message-details/:id', component: MessageDetailsComponent},
      { path: 'encounter-details/:id', component: EncounterDetailsComponent},
      { path: 'encounter-confirmation', component: EncounterConfirmationComponent },
      {
        path: 'patient-history/:patientId',
        loadComponent: () =>
          import('./pages/patient-history/patient-history.component').then(
            (m) => m.PatientHistoryComponent
          )
      },
    ]
  },

  // Wildcard/fallback route
  { path: '**', redirectTo: 'login' }
];
