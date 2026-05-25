import { jwtDecode } from 'jwt-decode';

export function getTokenValue(jwtToken: string, key: string): string | null {
  try {
    const decodedToken: any = jwtDecode(jwtToken);
    return decodedToken[key];
  } catch (error) {
    console.error('Error decoding JWT token:', error);
    return null;
  }
}