import { TestBed } from '@angular/core/testing';
import { ConfigService } from './config.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AppConfig } from '../../models/config/app-config';
import { CoreSpyFactories } from '@core/testing';
import { EnvironmentService } from './environment.service';

describe('ConfigService', () => {
  let configService: ConfigService;
  let httpTestingController: HttpTestingController;
  let fetchNextSpy: jasmine.Spy;
  let environmentService: jasmine.SpyObj<EnvironmentService>;

  beforeEach(() => {
    environmentService = CoreSpyFactories.createEnvironmentServiceSpy();

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ConfigService, { provide: EnvironmentService, useValue: environmentService }],
    });

    configService = TestBed.inject(ConfigService);
    httpTestingController = TestBed.inject(HttpTestingController);

    fetchNextSpy = jasmine.createSpy('fetchNext');

    environmentService.isProduction.and.returnValue(false);
  });

  it('should be created', () => {
    expect(configService).toBeTruthy();
  });

  it('should properly handle successful config fetch', (done: DoneFn) => {
    const dummyConfig = {
      radioBrowserApiUrl: 'testradiobrowserapi',
      radioBrowserSearchResultsLimit: 25,
      favoriteStationsApiUrl: 'testFavoritesApi',
      corsProxyUrl: 'corsProxyApi',
      authConfig: {},
      logging: {},
    } as any;

    // Listen to the initialize observable
    configService.appConfig$.subscribe({
      next: config => {
        expect(config).toEqual(dummyConfig as any);
        fetchNextSpy(config);
      },
      complete: () => {
        expect(fetchNextSpy).toHaveBeenCalledTimes(1);
        httpTestingController.verify();
        done();
      },
    });

    // Expect one app.config.json request & flush our dummy config object
    const appConfigRequest = httpTestingController.expectOne('/assets/config/app.config.json');
    const localConfigRequest = httpTestingController.expectOne('/assets/config/local.config.json');
    appConfigRequest.flush(dummyConfig);
    localConfigRequest.flush({});
  });

  it('should properly handle failed config fetch', (done: DoneFn) => {
    configService.appConfig$.subscribe({
      error: error => {
        expect(error).toBeTruthy();
        // Lastly, verify that there are no outstanding http requests
        httpTestingController.verify();
        done();
      },
    });

    // Expect one app.config.json request & throw our dummy error
    const appConfigRequest = httpTestingController.expectOne('/assets/config/app.config.json');
    const localConfigRequest = httpTestingController.expectOne('/assets/config/local.config.json');
    localConfigRequest.flush({});
    appConfigRequest.error(new ErrorEvent('test error'));
  });

  it('should merge local config with app config', (done: DoneFn) => {
    // Arrange
    const appConfig = {
      radioBrowserApiUrl: 'testradiobrowserapi',
      radioBrowserSearchResultsLimit: 25,
      favoriteStationsApiUrl: 'testFavoritesApi',
      authConfig: {
        issuer: 'app issuer',
        clientId: 'app client',
        logoutUrl: null,
      },
    };
    const localConfig = {
      corsProxyUrl: 'testCorsProxy',
      authConfig: {
        logoutUrl: 'some place',
        clientId: 'local client',
      },
      logging: {
        appInsightsInstrumentationKey: 'app insights key value',
      },
    };
    const mergedConfig = {
      radioBrowserApiUrl: 'testradiobrowserapi',
      radioBrowserSearchResultsLimit: 25,
      favoriteStationsApiUrl: 'testFavoritesApi',
      corsProxyUrl: 'testCorsProxy',
      authConfig: {
        issuer: 'app issuer',
        clientId: 'local client',
        logoutUrl: 'some place',
      },
      logging: {
        appInsightsInstrumentationKey: 'app insights key value',
      },
    } as any;

    configService.appConfig$.subscribe({
      next: config => {
        // Assert
        expect(config).toEqual(mergedConfig);
        fetchNextSpy(config);
      },
      complete: () => {
        // Assert
        expect(fetchNextSpy).toHaveBeenCalledTimes(1);

        httpTestingController.verify();
        done();
      },
    });

    // Act
    const appConfigRequest = httpTestingController.expectOne('/assets/config/app.config.json');
    const localConfigRequest = httpTestingController.expectOne('/assets/config/local.config.json');
    appConfigRequest.flush(appConfig);
    localConfigRequest.flush(localConfig);
  });

  it('should resolve app config if no local config is found', (done: DoneFn) => {
    configService.appConfig$.subscribe({
      next: config => {
        // Assert
        expect(config).toEqual({} as AppConfig);
        fetchNextSpy(config);
      },
      complete: () => {
        expect(fetchNextSpy).toHaveBeenCalledTimes(1);

        httpTestingController.verify();
        done();
      },
    });

    // Act
    const appConfigRequest = httpTestingController.expectOne('/assets/config/app.config.json');
    const localConfigRequest = httpTestingController.expectOne('/assets/config/local.config.json');
    appConfigRequest.flush({} as AppConfig);
    localConfigRequest.flush(null, {
      status: 404,
      statusText: 'Not Found',
    });
  });

  it('should fail if local config fetch failed with anything other than a 404', (done: DoneFn) => {
    configService.appConfig$.subscribe({
      next: config => fetchNextSpy(config),
      error: () => {
        expect(fetchNextSpy).not.toHaveBeenCalled();

        httpTestingController.verify();
        done();
      },
    });

    // Act
    const appConfigRequest = httpTestingController.expectOne('/assets/config/app.config.json');
    const localConfigRequest = httpTestingController.expectOne('/assets/config/local.config.json');
    appConfigRequest.flush({} as AppConfig);
    localConfigRequest.flush(null, {
      status: 403,
      statusText: 'Can Not Has',
    });
  });

  it('should fetch local config if running the app in dev mode', (done: DoneFn) => {
    // Arrange
    environmentService.isProduction.and.returnValue(false);

    // Listen to the initialize observable
    configService.appConfig$.subscribe({
      next: config => {
        fetchNextSpy(config);
      },
      complete: () => {
        expect(fetchNextSpy).toHaveBeenCalledTimes(1);

        httpTestingController.verify();
        done();
      },
    });

    // Expect one app.config.json request & flush our dummy config object
    const appConfigRequest = httpTestingController.expectOne('/assets/config/app.config.json');
    const localConfigRequest = httpTestingController.expectOne('/assets/config/local.config.json');
    appConfigRequest.flush({});
    localConfigRequest.flush({});
  });

  it('should not fetch local config if running the app in prod mode', (done: DoneFn) => {
    // Arrange
    environmentService.isProduction.and.returnValue(true);

    // Listen to the initialize observable
    configService.appConfig$.subscribe({
      next: config => {
        fetchNextSpy(config);
      },
      complete: () => {
        expect(fetchNextSpy).toHaveBeenCalledTimes(1);

        httpTestingController.expectNone('/assets/config/local.config.json');
        httpTestingController.verify();
        done();
      },
    });

    // Expect one app.config.json request & flush our dummy config object
    expect(environmentService.isProduction).toHaveBeenCalledTimes(1);
    const appConfigRequest = httpTestingController.expectOne('/assets/config/app.config.json');
    appConfigRequest.flush({});
  });

  it('should only request the config once even if there are multiple concurrent and subsequent requests', () => {
    // Arrange
    environmentService.isProduction.and.returnValue(true);
    const firstRequest = jasmine.createSpy('firstRequest');
    const secondRequest = jasmine.createSpy('secondRequest');
    const thirdRequest = jasmine.createSpy('thirdRequest');
    const fourthRequest = jasmine.createSpy('fourthRequest');

    // Request the config twice before flushing to test that the response is replayed for concurrent requests
    configService.appConfig$.subscribe(config => firstRequest(config));
    configService.appConfig$.subscribe(config => secondRequest(config));

    expect(firstRequest).not.toHaveBeenCalled();
    expect(secondRequest).not.toHaveBeenCalled();

    const appConfigRequest = httpTestingController.expectOne('/assets/config/app.config.json');
    appConfigRequest.flush({});

    // Request the config another two times after flushing to test that the response is replayed for subsequent requests
    configService.appConfig$.subscribe(config => thirdRequest(config));
    configService.appConfig$.subscribe(config => fourthRequest(config));

    expect(firstRequest).toHaveBeenCalledTimes(1);
    expect(secondRequest).toHaveBeenCalledTimes(1);
    expect(thirdRequest).toHaveBeenCalledTimes(1);
    expect(fourthRequest).toHaveBeenCalledTimes(1);

    httpTestingController.expectNone('/assets/config/app.config.json');
    httpTestingController.verify();
  });
});
