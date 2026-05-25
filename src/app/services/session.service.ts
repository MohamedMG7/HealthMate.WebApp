import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor() { }

  private username?: string;
  private healthcareProviderId?: string;
  private applicationUserId?: string;
  private hcpMail?: string;
  private Token?: string;
  private specialization?: string;

  // Setters
  setSpecialization(specialization: string) {
    this.specialization = specialization;
  }

  setToken(Token: string){
    this.Token = Token;
  }

  sethcpMail(hcpMail: string){
    this.hcpMail = hcpMail;
  }

  setUsername(username: string) {
    this.username = username;
  }

  setHealthcareProviderId(id: string) {
    this.healthcareProviderId = id;
  }

  setApplicationUserId(id: string) {
    this.applicationUserId = id;
  }

  // Getters
  getSpecialization(): string | undefined {
    return this.specialization;
  }
  
  getUsername(): string | undefined {
    return this.username;
  }

  getHealthcareProviderId(): string | undefined {
    return this.healthcareProviderId;
  }

  getApplicationUserId(): string | undefined {
    return this.applicationUserId;
  }

  gethcpMail() : string | undefined{
    return this.hcpMail;
  }
  
  getToken() : string | undefined{
    return this.Token;
  }

  // Optional: Clear
  clearSession() {
    this.username = undefined;
    this.healthcareProviderId = undefined;
    this.applicationUserId = undefined;
    this.Token = undefined;
  }
}
