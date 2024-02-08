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
    const appConfig = {
      radioBrowserApiUrl: 'testradiobrowserapi',
      radioBrowserSearchResultsLimit: 25,
      favoriteStationsApiUrl: 'testFavoritesApi',
      corsProxyUrl: 'corsProxyApi',
      authConfig: {},
      logging: {},
    } as any;
    const localConfig = {
      radioBrowserApiUrl: 'testradiobrowserapibutdifferent',
    } as any;

    // Listen to the initialize observable
    configService.fetch().subscribe({
      next: configs => {
        expect(configs).toEqual({ appConfig, localConfig });
        fetchNextSpy(configs);
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
    appConfigRequest.flush(appConfig);
    localConfigRequest.flush(localConfig);
  });

  it('should properly handle failed config fetch', (done: DoneFn) => {
    configService.fetch().subscribe({
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

  it('should resolve app config if no local config is found', (done: DoneFn) => {
    configService.fetch().subscribe({
      next: config => {
        // Assert
        expect(config).toEqual({ appConfig: {}, localConfig: null } as any);
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
    appConfigRequest.flush({} as any);
    localConfigRequest.flush(null, {
      status: 404,
      statusText: 'Not Found',
    });
  });

  it('should fail if local config fetch failed with anything other than a 404', (done: DoneFn) => {
    configService.fetch().subscribe({
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
    configService.fetch().subscribe({
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
    configService.fetch().subscribe({
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
});
