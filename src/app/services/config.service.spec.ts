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
      ]
    });

    configService = TestBed.get(ConfigService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(configService).toBeTruthy();
  });

  it('should properly handle successful config fetch', (done: DoneFn) => {
    const dummyConfig: IAppConfig = {
      'metadataApiUrl': 'testapi',
      'radioBrowserApiUrl': 'testradiobrowserapi',
      'metadataRefreshInterval': 1,
      'metadataFetchTimeout': 2
    };

    // Listen on the initialize promise
    configService.initialize().then(initialized => {
      /* On successful resolve, we expect the initialize accessors
      to indicate a successful config fetch with no error. */
      expect(initialized).toBe(true);
      expect(configService.initialized).toBe(true);
      expect(configService.initializationError).toBeNull();
      /* The exposed appConfig should match the one flushed
      by the http testing controller */
      expect(configService.appConfig).toEqual(dummyConfig);
      // Lastly, verify that there are no outstanding http requests
      httpTestingController.verify();
      done();
    });

    // Expect one app.config.json request & flush our dummy config object
    const configRequest = httpTestingController.expectOne('/assets/config/app.config.json');
    configRequest.flush(dummyConfig);
  });

  it('should properly handle failed config fetch', (done: DoneFn) => {
    // Listen for initialize resolve
    configService.initialize().then(initialized => {
      /* On failure, we expect initialize to resolve
      successfully with an 'initialized' value of
      false, appConfig value of undefined, and an exposed
      error. */
      expect(initialized).toBe(false);
      expect(configService.initialized).toBe(false);
      expect(configService.appConfig).toBeUndefined();
      expect(configService.initializationError).not.toBeNull();
      // Lastly, verify that there are no outstanding http requests
      httpTestingController.verify();
      done();
    });

    // Expect one app.config.json request & throw our dummy error
    const configRequest = httpTestingController.expectOne('/assets/config/app.config.json');
    configRequest.error(new ErrorEvent('test error'));
  });
});
