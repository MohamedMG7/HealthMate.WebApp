import { jwtDecode } from 'jwt-decode';
import { JwtClaims } from '../models/auth.models';

export function decodeJwt(token: string): JwtClaims | null {
  try {
    return jwtDecode<JwtClaims>(token);
  } catch {
    return null;
  }
}
