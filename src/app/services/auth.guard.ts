import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private sessionService: SessionService) {}

  canActivate(): boolean | UrlTree {
    const token = this.sessionService.getToken();
    return token ? true : this.router.createUrlTree(['/login']);
  }
}
