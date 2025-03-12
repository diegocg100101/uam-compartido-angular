import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authenticatedStatus = new BehaviorSubject<boolean>(false);
  status$ = this.authenticatedStatus.asObservable();

  constructor(public jwtHelperService: JwtHelperService) {}

  public isAuthenticated(): boolean {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');
      const authenticated = !this.jwtHelperService.isTokenExpired(token);
      this.authenticatedStatus.next(authenticated);
      return authenticated;
    }
    this.authenticatedStatus.next(false);
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

  public isAdmin() {
    const token = localStorage.getItem('token');
    if (token) {
      const tokenDecoded = this.jwtHelperService.decodeToken(token);
      return tokenDecoded.role === 'ROLE_ADMIN';
    }
    return false;
  }

}
