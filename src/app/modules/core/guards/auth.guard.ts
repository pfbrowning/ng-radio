import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { tap, filter, switchMap } from 'rxjs/operators';
import { RootState } from '@core';
import { Store, select } from '@ngrx/store';
import { selectIsAuthenticationInitialized, selectIsAuthenticated } from '../store/authentication/authentication.selectors';
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private store: Store<RootState>, private oauthService: OAuthService) {}

    canActivate(): Observable<boolean> {
        return this.store.pipe(
            select(selectIsAuthenticationInitialized),
            filter(initialized => initialized),
            switchMap(() => this.store.pipe(
                select(selectIsAuthenticated),
                tap(authenticated => {
                    if (!authenticated) {
                        this.oauthService.initImplicitFlow();
                    }
                })
            ))
        );
    }
}
