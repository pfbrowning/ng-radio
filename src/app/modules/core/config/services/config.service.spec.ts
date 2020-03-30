import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ConfigService } from './config.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { IAppConfig } from '../models/app-config';

describe('ConfigService', () => {
  let configService: ConfigService;
  let httpTestingController: HttpTestingController;

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

    // Listen to the initialize observable
    configService.fetch().subscribe(config => {
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
    configService.fetch().subscribe({
      error: error => {
        expect(configService.appConfig).toBeUndefined();
        // Lastly, verify that there are no outstanding http requests
        httpTestingController.verify();
        done();
      }
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

    configService.fetch().subscribe(config => {
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

    configService.fetch().subscribe(config => {
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
