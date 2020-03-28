import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ConfigService } from './config.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { IAppConfig } from '../models/app-config';

describe('ConfigService', () => {
  let configService: ConfigService;
  let httpTestingController: HttpTestingController;
  let loadedSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        ConfigService
      ]
    });

    configService = TestBed.inject(ConfigService);
    httpTestingController = TestBed.inject(HttpTestingController as Type<HttpTestingController>);
    loadedSpy = jasmine.createSpy('loaded');
    configService.loaded$.subscribe(() => loadedSpy());
  });

  it('should be created', () => {
    expect(configService).toBeTruthy();
  });

  it('should properly handle successful config fetch', (done: DoneFn) => {
    const dummyConfig: IAppConfig = {
      metadataApiUrl: 'testapi',
      radioBrowserApiUrl: 'testradiobrowserapi',
      favoriteStationsApiUrl: 'testFavoritesApi',
      metadataRefreshInterval: 1,
      metadataFetchTimeout: 2,
      appInsightsInstrumentationKey: null,
      authConfig: {}
    };

    expect(loadedSpy).not.toHaveBeenCalled();

    // Listen to the initialize observable
    configService.initialize().subscribe(config => {
      /* On successful resolve, we expect the initialize accessors
      to indicate a successful config fetch with no error. */
      expect(configService.initialized).toBe(true);
      expect(configService.initializationError).toBeNull();
      // loaded$ should have emitted once on successful config load
      expect(loadedSpy).toHaveBeenCalledTimes(1);
      /* The exposed appConfig should match the one flushed
      by the http testing controller */
      expect(configService.appConfig).toEqual(dummyConfig);
      expect(config).toEqual(dummyConfig);
      // Lastly, verify that there are no outstanding http requests
      httpTestingController.verify();
      done();
    });

    // Expect one app.config.json request & flush our dummy config object
    const appConfigRequest = httpTestingController.expectOne('/assets/config/app.config.json');
    const localConfigRequest = httpTestingController.expectOne('/assets/config/local.config.json');
    appConfigRequest.flush(dummyConfig);
    localConfigRequest.flush({});
  });

  it('should properly handle failed config fetch', (done: DoneFn) => {
    // Listen for initialize resolve
    configService.initialize().subscribe(config => {
      /* On failure, we expect initialize to resolve
      successfully with an 'initialized' value of
      false, appConfig value of undefined, and an exposed
      error.  loaded$ should not emit anything.*/
      expect(configService.initialized).toBe(false);
      expect(configService.appConfig).toBeUndefined();
      expect(configService.initializationError).not.toBeNull();
      expect(loadedSpy).not.toHaveBeenCalled();
      // Lastly, verify that there are no outstanding http requests
      httpTestingController.verify();
      done();
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
      metadataApiUrl: 'testapi',
      radioBrowserApiUrl: 'testradiobrowserapi',
      favoriteStationsApiUrl: 'testFavoritesApi',
      metadataRefreshInterval: 1,
      metadataFetchTimeout: 2,
      authConfig: {
        'issuer': 'app issuer',
        'clientId': 'app client',
        'logoutUrl': null
      }
    };
    const localConfig = {
      appInsightsInstrumentationKey: 'app insights key value',
      authConfig: {
        logoutUrl: 'some place',
        clientId: 'local client'
      }
    };
    const mergedConfig = {
      metadataApiUrl: 'testapi',
      radioBrowserApiUrl: 'testradiobrowserapi',
      favoriteStationsApiUrl: 'testFavoritesApi',
      metadataRefreshInterval: 1,
      metadataFetchTimeout: 2,
      appInsightsInstrumentationKey: 'app insights key value',
      authConfig: {
        issuer: 'app issuer',
        clientId: 'local client',
        logoutUrl: 'some place',
      }
    };

    configService.initialize().subscribe(config => {
      // Assert
      expect(config).toEqual(mergedConfig);

      // Lastly, verify that there are no outstanding http requests
      httpTestingController.verify();
      done();
    });

    // Act
    const appConfigRequest = httpTestingController.expectOne('/assets/config/app.config.json');
    const localConfigRequest = httpTestingController.expectOne('/assets/config/local.config.json');
    appConfigRequest.flush(appConfig);
    localConfigRequest.flush(localConfig);
  });

  it('should resolve app config if no local config is found', (done: DoneFn) => {
    // Arrange
    const appConfig = {
      metadataApiUrl: 'testapi',
      appInsightsInstrumentationKey: 'app insights key value',
      radioBrowserApiUrl: 'testradiobrowserapi',
      favoriteStationsApiUrl: 'testFavoritesApi',
      metadataRefreshInterval: 1,
      metadataFetchTimeout: 2,
      authConfig: {}
    };

    configService.initialize().subscribe(config => {
      // Assert
      expect(config).toEqual(appConfig);

      // Lastly, verify that there are no outstanding http requests
      httpTestingController.verify();
      done();
    });

    // Act
    const appConfigRequest = httpTestingController.expectOne('/assets/config/app.config.json');
    const localConfigRequest = httpTestingController.expectOne('/assets/config/local.config.json');
    appConfigRequest.flush(appConfig);
    localConfigRequest.flush(null, { status: 404, statusText: 'Not Found' });
  });
});
