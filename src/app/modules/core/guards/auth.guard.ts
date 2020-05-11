import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { tap, filter, switchMap } from 'rxjs/operators';
import { RootState } from '@core';
import { Store, select } from '@ngrx/store';
import { AuthenticationSelectors } from '../store/authentication/.';
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private store: Store<RootState>, private oauthService: OAuthService) {}

    canActivate(): Observable<boolean> {
        return this.store.pipe(
            select(AuthenticationSelectors.isInitialized),
            filter(initialized => initialized),
            switchMap(() => this.store.pipe(
                select(AuthenticationSelectors.selectIsAuthenticated),
                tap(authenticated => {
                    if (!authenticated) {
                        this.oauthService.initImplicitFlow();
                    }
                })
            ))
        );
    }
}
