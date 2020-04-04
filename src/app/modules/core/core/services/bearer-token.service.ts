import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { RootState } from '../models/root-state';
import { selectConfig } from '@core/store/config/selectors';
import { filter, switchMap } from 'rxjs/operators';
import { selectInitializedAndAccessToken } from '../store/authentication/authentication.selectors';

@Injectable()
export class BearerTokenService implements HttpInterceptor {
  constructor(private store: Store<RootState>) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Don't handle the initial config fetch at all
    if (req.url.endsWith('/assets/config/app.config.json') || req.url.endsWith('/assets/config/local.config.json')) {
      return next.handle(req);
    }
    return this.store.pipe(
      select(selectConfig),
      // Wait for the config to load if it isn't loaded already
      filter(config => config != null),
      switchMap(config => {
        // If the URL is one of our configured URLs which requires authentication, then provide a bearer token.
        if (req.url.startsWith(config.favoriteStationsApiUrl) || req.url.startsWith(config.metadataApiUrl)) {
          return this.store.pipe(
            select(selectInitializedAndAccessToken),
            // Wait for authentication to initialize, regardless of whether the user is authenticated
            filter(selected => selected.initialized),
            switchMap(selected => {
              // If an access token is present, then append it to the Authorization header
              if (selected.accessToken != null) {
                return next.handle(req.clone({ headers: req.headers.append('Authorization', `Bearer ${selected.accessToken}`) }));
              }
              // If no access token is present, pass the unmodified request to the next handler
              return next.handle(req);
            })
          );
        } else {
          // If this isn't an authorization-required URL, then pass the unmodified request to the next handler
          return next.handle(req);
        }
      })
    );
  }
}
