import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { AuthenticationFacadeService } from '../../store/authentication/authentication-facade.service';
import isFalsyOrWhitespace from 'is-falsy-or-whitespace';
import { ConfigProviderService } from '../config/config-provider.service';
import { AccessTokenProviderService } from './access-token-provider.service';

@Injectable()
export class BearerTokenService implements HttpInterceptor {
  constructor(
    private configProvider: ConfigProviderService,
    private accessTokenProvider: AccessTokenProviderService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Don't handle the initial config fetch at all
    if (
      req.url.endsWith('/assets/config/app.config.json') ||
      req.url.endsWith('/assets/config/local.config.json')
    ) {
      return next.handle(req);
    }
    // Wait for the config to load if it isn't loaded already
    return this.configProvider.getConfigOnceLoaded().pipe(
      switchMap(config => {
        // If the URL is one of our configured URLs which requires authentication, then provide a bearer token.
        if (
          [config.favoriteStationsApiUrl, config.radioProxyUrl].some(authUrl =>
            req.url.startsWith(authUrl)
          )
        ) {
          return this.accessTokenProvider.getAccessTokenOnceAuthenticated().pipe(
            take(1),
            switchMap(accessToken =>
              !isFalsyOrWhitespace(accessToken)
                ? // If an access token is present, then append it to the Authorization header
                  next.handle(
                    req.clone({
                      headers: req.headers.append('Authorization', `Bearer ${accessToken}`),
                    })
                  )
                : // If no access token is present, pass the unmodified request to the next handler
                  next.handle(req)
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
