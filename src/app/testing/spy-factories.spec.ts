import { Subject, ReplaySubject, of } from 'rxjs';
import { NowPlaying } from '../models/now-playing';
import { EventEmitter } from '@angular/core';
import { Metadata } from '../models/metadata';
import { AppError } from '../models/app-error';

export class SpyFactories {
  public static CreateConfigServiceSpy(): any {
    const spy = jasmine.createSpyObj('configService', ['initialize']);
    spy['appConfig'] = {
      'metadataApiUrl': 'test.com',
      'radioBrowserApiUrl': 'test.com',
      'metadataRefreshInterval': 15000,
      'metadataFetchTimeout': 10
    };
    spy['loaded$'] = new Subject();
    spy['initialized'] = true;
    return spy;
  }
  public static CreateErrorHandlingServiceSpy(): any {
    const spy = jasmine.createSpyObj('errorHandlingService', ['handleError']);
    spy['appError'] = new ReplaySubject<AppError>(1);
    return spy;
  }

  public static CreatePlayerServiceSpy(): any {
    const spy = jasmine.createSpyObj('playerService', ['playStation']);
    spy['nowPlaying$'] = new Subject<NowPlaying>();
    spy['audioPaused'] = new EventEmitter<void>();
    return spy;
  }

  public static CreateRadioBrowserServiceSpy(): any {
    const spy = jasmine.createSpyObj('radioBrowser', ['searchStations']);
    return spy;
  }

  public static CreateNotificationServiceSpy(): any {
    const spy = jasmine.createSpyObj('notificationServiceSpy', ['notify']);
    return spy;
  }

  public static CreateNoSleepSpy(): any {
    return jasmine.createSpyObj('noSleep', ['enable', 'disable']);
  }

  public static CreateNoSleepServiceSpy(): any {
    return jasmine.createSpyObj('noSleepService', ['enable', 'disable']);
  }

  public static CreateMessageServiceSpy(): any {
    return jasmine.createSpyObj('messageServiceSpy', ['add']);
  }

  public static CreateAppInsightsServiceSpy(): any {
    return jasmine.createSpyObj('appInsightsService', ['trackException', 'trackEvent']);
  }

  public static CreateLoggingServiceSpy(): any {
    return jasmine.createSpyObj('loggingService', ['logException', 'logEvent']);
  }
}
