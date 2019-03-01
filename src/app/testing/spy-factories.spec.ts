import { Subject } from 'rxjs';
import { NowPlaying } from '../models/now-playing';
import { EventEmitter } from '@angular/core';

export class SpyFactories {
  public static CreateConfigServiceSpy(): any {
    const spy = jasmine.createSpyObj('configService', ['initialize']);
    spy['appConfig'] = {
      'metadataApiUrl': 'test.com',
      'radioBrowserApiUrl': 'test.com',
      'metadataRefreshInterval': 0,
      'metadataFetchTimeout': 10
    };
    spy['initialized'] = true;
    return spy;
  }
  public static CreateErrorHandlingServiceSpy(): any {
    const spy = jasmine.createSpyObj('errorHandlingService', ['handleError']);
    return spy;
  }

  public static CreatePlayerServiceSpy(): any {
    const spy = jasmine.createSpyObj('playerService', ['playStation']);
    spy['nowPlaying$'] = new Subject<NowPlaying>();
    spy['audioPaused'] = new EventEmitter<void>();
    return spy;
  }

  public static CreateMetadataServiceSpy(): any {
    const spy = jasmine.createSpyObj('metadataService', ['getMetadata']);
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

  public static CreateHTMLAudioElementSpy(): any {
    const spy = jasmine.createSpyObj('audio', ['play']);
    return spy;
  }
}
