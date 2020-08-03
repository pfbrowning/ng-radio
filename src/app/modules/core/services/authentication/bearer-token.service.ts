import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ConfigService } from '@core/services';
import { isFalsyOrWhitespace } from '@utilities';
import { AuthenticationFacadeService } from '../../store/authentication/authentication-facade.service';

@Injectable()
export class BearerTokenService implements HttpInterceptor {
  constructor(
    private configService: ConfigService,
    private authenticationFacade: AuthenticationFacadeService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Don't handle the initial config fetch at all
    if (req.url.endsWith('/assets/config/app.config.json') || req.url.endsWith('/assets/config/local.config.json')) {
      return next.handle(req);
    }
    // Wait for the config to load if it isn't loaded already
    return this.configService.appConfig$.pipe(
      switchMap(config => {
        // If the URL is one of our configured URLs which requires authentication, then provide a bearer token.
        if (req.url.startsWith(config.favoriteStationsApiUrl) || req.url.startsWith(config.metadataApiUrl)) {
          return this.authenticationFacade.accessToken$.pipe(
            switchMap(accessToken => !isFalsyOrWhitespace(accessToken)
              // If an access token is present, then append it to the Authorization header
              ? next.handle(req.clone({ headers: req.headers.append('Authorization', `Bearer ${accessToken}`) }))
              // If no access token is present, pass the unmodified request to the next handler
              : next.handle(req)
            )
          );
        } else {
          // If this isn't an authorization-required URL, then pass the unmodified request to the next handler
          return next.handle(req);
        }
      })
    );
  }
}
