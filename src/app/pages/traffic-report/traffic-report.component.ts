import { Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../../services/config';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-traffic-report',
  standalone: true,
  imports: [],
  templateUrl: './traffic-report.component.html',
  styleUrls: ['./traffic-report.component.css']
})
export class TrafficReportComponent implements OnInit {
  report: any = null;

  constructor(private http: HttpClient, private sessionService: SessionService) {}

  ngOnInit(): void {
    //const providerId = sessionStorage.getItem("hcpId");
    const providerId = this.sessionService.getHealthcareProviderId();
    const token = this.sessionService.getToken(); // or wherever you're storing it

  
    const headers = {
      'Authorization': `Bearer ${token}`
    };
  
    this.http.get(`${BASE_URL}Reporter/Traffic-Report?healthcareProviderId=${providerId}`, { headers })
      .subscribe(data => {
        this.report = data;
      });
  }

  getEntries(obj: any): [string, any][] {
    return Object.entries(obj);
  }
}
