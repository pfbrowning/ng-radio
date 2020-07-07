import { TestBed } from '@angular/core/testing';
import { BearerTokenService } from './bearer-token.service';
import { ConfigService } from '../config.service';
import { CoreSpyFactories } from '@core/testing';
import { OAuthService } from 'angular-oauth2-oidc';
import { AuthenticationService } from './authentication.service';
import { AuthenticationServiceStub } from '../../testing/stubs/authentication-service-stub.spec';
import { of, NEVER } from 'rxjs';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';

describe('BearerTokenService', () => {
  let bearerTokenService: BearerTokenService;
  let oauthService: jasmine.SpyObj<OAuthService>;
  let configService: jasmine.SpyObj<ConfigService>;
  let authenticationService: AuthenticationServiceStub;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  const config: any = Object.freeze({ favoriteStationsApiUrl: 'mockFavoritesUrl', metadataApiUrl: 'mockMetadataUrl' });

  beforeEach(() => {
    oauthService = CoreSpyFactories.createOAuthServiceSpy();
    configService = CoreSpyFactories.createConfigServiceSpy();

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        BearerTokenService,
        { provide: ConfigService, useValue: configService },
        { provide: OAuthService, useValue: oauthService },
        { provide: AuthenticationService, useClass: AuthenticationServiceStub },
        { provide: HTTP_INTERCEPTORS, useClass: BearerTokenService, multi: true }
      ]
    });

    bearerTokenService = TestBed.inject(BearerTokenService);
    authenticationService = TestBed.inject(AuthenticationService) as any;
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);

    configService.appConfig$ = of(config);
  });

  it('should be created', () => {
    expect(bearerTokenService).toBeTruthy();
  });

  const shouldAddTokenCases = [
    'mockFavoritesUrl',
    'mockFavoritesUrl/somePath',
    'mockMetadataUrl',
    'mockMetadataUrl/somePath'
  ];
  shouldAddTokenCases.forEach(url => {
    it(`should add a bearer token if the request is for an API url specified in the config: ${url}`, (done: DoneFn) => {
      // Arrange
      oauthService.getAccessToken.and.returnValue('mockAccessToken');
      authenticationService.authenticated$ = of(true);

      // Act
      httpClient.get(url).subscribe(() => {
        // Assert
        httpTestingController.verify();
        expect(oauthService.getAccessToken).toHaveBeenCalledTimes(2);

        done();
      });

      // Assert
      const request = httpTestingController.expectOne(req => req.headers.get('Authorization') === 'Bearer mockAccessToken');
      request.flush({data: 'test'});
    });
  });

  const shouldNotAddTokenCases = [
    { requestedUrl: 'somePathThatDoesntStartWithAConfiguredApiPath', authenticated: true, accessToken: 'mockToken' },
    { requestedUrl: 'mockFavoritesUrl/somePath', authenticated: false, accessToken: 'mockToken' },
    { requestedUrl: 'mockFavoritesUrl/somePath', authenticated: true, accessToken: '   ' },
  ];
  shouldNotAddTokenCases.forEach(input => {
    it(`should not add a token: ${JSON.stringify(input)}`, (done: DoneFn) => {
      // Arrange
      authenticationService.authenticated$ = of(input.authenticated);
      oauthService.getAccessToken.and.returnValue(input.accessToken);

      // Act
      httpClient.get(input.requestedUrl).subscribe(() => {
        // Assert
        httpTestingController.verify();

        done();
      });

      // Assert
      const request = httpTestingController.expectOne(req => !req.headers.has('Authorization'));
      request.flush({data: 'test'});
    });
  });

  const shouldShortCircuitConfigFetchCases = [
    '/assets/config/app.config.json',
    '/assets/config/local.config.json'
  ];
  shouldShortCircuitConfigFetchCases.forEach(requestedUrl => {
    it(`should short-circuit config fetch: ${requestedUrl}`, (done: DoneFn) => {
      // Arrange
      authenticationService.authenticated$ = NEVER;
      configService.appConfig$ = NEVER;

      // Act
      httpClient.get(requestedUrl).subscribe(() => {
        // Assert
        httpTestingController.verify();

        done();
      });

      // Assert
      const request = httpTestingController.expectOne(req => !req.headers.has('Authorization'));
      request.flush({data: 'test'});
    });
  });
});
