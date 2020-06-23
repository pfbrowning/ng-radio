import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable, of, NEVER } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { OAuthService } from 'angular-oauth2-oidc';
import { AuthenticationService } from './authentication.service';

@Injectable({providedIn: 'root'})
export class AuthGuardService implements CanActivate {
  constructor(private authenticationService: AuthenticationService, private oauthService: OAuthService) {}

  canActivate(): Observable<boolean> {
    return this.authenticationService.authenticated$.pipe(
      switchMap(authenticated => {
        if (authenticated) {
          return of(true);
        }
        this.oauthService.initCodeFlow();
        return NEVER;
      })
    );
  }
}
