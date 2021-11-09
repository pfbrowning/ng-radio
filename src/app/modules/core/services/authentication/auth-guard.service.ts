import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable, of, NEVER } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { AuthenticationFacadeService } from '../../store/authentication/authentication-facade.service';

@Injectable({ providedIn: 'root' })
export class AuthGuardService implements CanActivate {
  constructor(private authenticationFacade: AuthenticationFacadeService) {}

  canActivate(): Observable<boolean> {
    return this.authenticationFacade.authenticated$.pipe(
      take(1),
      switchMap(authenticated => {
        if (authenticated) {
          return of(true);
        }
        this.authenticationFacade.logInRedirect();
        return NEVER;
      })
    );
  }
}
