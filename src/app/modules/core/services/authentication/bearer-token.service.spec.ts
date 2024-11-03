import { TestBed } from '@angular/core/testing';
import { BearerTokenService } from './bearer-token.service';
import { CoreSpyFactories } from '@core/testing';
import { of, NEVER } from 'rxjs';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpClient, HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AccessTokenProviderService } from './access-token-provider.service';
import { ConfigProviderService } from '../config/config-provider.service';

describe('BearerTokenService', () => {
  let bearerTokenService: BearerTokenService;
  let configProvider: jasmine.SpyObj<ConfigProviderService>;
  let accessTokenProvider: jasmine.SpyObj<AccessTokenProviderService>;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  const config: any = Object.freeze({
    favoriteStationsApiUrl: 'mockFavoritesUrl',
    radioProxyUrl: 'mockRadioProxyUrl',
  });

  beforeEach(() => {
    accessTokenProvider = CoreSpyFactories.createAccessTokenProviderSpy();
    configProvider = CoreSpyFactories.createConfigProviderSpy();

    TestBed.configureTestingModule({
    imports: [],
    providers: [
        BearerTokenService,
        { provide: ConfigProviderService, useValue: configProvider },
        {
            provide: AccessTokenProviderService,
            useValue: accessTokenProvider,
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: BearerTokenService,
            multi: true,
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
    ]
});

    bearerTokenService = TestBed.inject(BearerTokenService);
    accessTokenProvider = TestBed.inject(AccessTokenProviderService) as any;
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);

    configProvider.getConfigOnceLoaded.and.returnValue(of(config));
  });

  it('should be created', () => {
    expect(bearerTokenService).toBeTruthy();
  });

  const shouldAddTokenCases = [
    'mockFavoritesUrl',
    'mockFavoritesUrl/somePath',
    'mockRadioProxyUrl',
    'mockRadioProxyUrl/somePath',
  ];
  shouldAddTokenCases.forEach(url => {
    it(`should add a bearer token if the request is for an API url specified in the config: ${url}`, (done: DoneFn) => {
      // Arrange
      const expectedHeader = 'Bearer mockAccessToken';
      accessTokenProvider.getAccessTokenOnceAuthenticated.and.returnValue(of('mockAccessToken'));

      // Act
      httpClient.get(url).subscribe(() => {
        // Assert
        httpTestingController.verify();

        done();
      });

      // Assert
      const request = httpTestingController.expectOne(
        req => req.headers.get('Authorization') === expectedHeader
      );
      request.flush({ data: 'test' });

      expect(request.request.headers.get('Authorization')).toBe(expectedHeader);
    });
  });

  const shouldNotAddTokenCases = [
    {
      requestedUrl: 'somePathThatDoesntStartWithAConfiguredApiPath',
      accessToken: 'mockToken',
    },
    { requestedUrl: 'mockFavoritesUrl/somePath', accessToken: '   ' },
  ];
  shouldNotAddTokenCases.forEach(input => {
    it(`should not add a token: ${JSON.stringify(input)}`, (done: DoneFn) => {
      // Arrange
      accessTokenProvider.getAccessTokenOnceAuthenticated.and.returnValue(of(input.accessToken));

      // Act
      httpClient.get(input.requestedUrl).subscribe(() => {
        // Assert
        httpTestingController.verify();

        done();
      });

      // Assert
      const request = httpTestingController.expectOne(req => !req.headers.has('Authorization'));
      request.flush({ data: 'test' });

      expect(request.request.headers.has('Authorization')).toBeFalse();
    });
  });

  const shouldShortCircuitConfigFetchCases = [
    '/assets/config/app.config.json',
    '/assets/config/local.config.json',
  ];
  shouldShortCircuitConfigFetchCases.forEach(requestedUrl => {
    it(`should short-circuit config fetch: ${requestedUrl}`, (done: DoneFn) => {
      // Arrange
      configProvider.getConfigOnceLoaded.and.returnValue(NEVER);

      // Act
      httpClient.get(requestedUrl).subscribe(() => {
        // Assert
        httpTestingController.verify();

        done();
      });

      // Assert
      const request = httpTestingController.expectOne(req => !req.headers.has('Authorization'));
      request.flush({ data: 'test' });

      expect(request.request.headers.has('Authorization')).toBeFalse();
    });
  });
});
