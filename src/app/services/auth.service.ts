import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public jwtHelperService: JwtHelperService) {}

  public isAuthenticated(): boolean {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');
      return !this.jwtHelperService.isTokenExpired(token);
    }
    return false;
  }

  public getRole() {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        const tokenDecoded = this.jwtHelperService.decodeToken(token);
        return tokenDecoded.role;
      }
      return null;
    }
  }

}
