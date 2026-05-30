export interface LoginRequest {
  email: string;
  password: string;
  stayLoggedIn: boolean;
}

export interface LoginResponse {
  jwtToken: string;
}

export interface JwtClaims {
  HealthCareProviderId?: string;
  email?: string;
  sub?: string;
  UserName?: string;
  specialization?: string;
  exp?: number;
}
