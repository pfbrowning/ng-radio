import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private authenticationService: AuthenticationService) {}

    canActivate(): Observable<boolean> {
        // Once the login has been processed
        return this.authenticationService.tokenProcessed$.pipe(
            // Map the authenticated state as the canActivate result
            map(() => this.authenticationService.authenticated),
            tap(authenticated => {
                /* If the user isn't authenticated, then send them directly
                to the identity provider for login, rather than sending them
                to a login landing page.
                I want the user to be authenticated before they access the app
                at all because I want to secure the now playing API with an
                access token. */
                if (!authenticated) {
                    this.authenticationService.initImplicitFlow();
                }
            })
        );
    }
}
