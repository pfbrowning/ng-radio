import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { PlayerEffects } from './player.effects';
import { provideMockStore } from '@ngrx/store/testing';
import { initialRootState } from '../../models/initial-root-state';
import { CurrentTimeService } from '../../services/current-time.service';
import { CoreSpyFactories, PlayerFacadeStub, StreamMetadataFacadeStub } from '@core/testing';
import { AudioElementStub } from '../../testing/AudioElementStub.spec';
import { ConfigStubService } from '../../testing/stubs/config-stub-service.spec';
import {
  NotificationsService,
  LoggingService,
  AudioElementService,
  ConfigService,
  AudioProxyService,
  SleepTimerService,
} from '@core/services';
import { PlayerFacadeService } from './player-facade.service';
import { StreamMetadataFacadeService } from '../stream-metadata/stream-metadata-facade.service';

describe('PlayerEffects', () => {
  const actions$: Observable<any> = null;
  let effects: PlayerEffects;
  let audioElement: AudioElementStub;

  beforeEach(() => {
    audioElement = new AudioElementStub();

    TestBed.configureTestingModule({
      providers: [
        PlayerEffects,
        provideMockActions(() => actions$),
        {
          provide: NotificationsService,
          useValue: CoreSpyFactories.createNotificationsServiceSpy(),
        },
        { provide: AudioElementService, useValue: audioElement },
        {
          provide: CurrentTimeService,
          useValue: CoreSpyFactories.createCurrentTimeServiceSpy(),
        },
        {
          provide: LoggingService,
          useValue: CoreSpyFactories.createLoggingServiceSpy(),
        },
        {
          provide: AudioProxyService,
          useValue: CoreSpyFactories.createAudioProxyService(),
        },
        {
          provide: SleepTimerService,
          useValue: CoreSpyFactories.createSleepTimerServiceSpy(),
        },
        {
          provide: PlayerFacadeService,
          useClass: PlayerFacadeStub,
        },
        {
          provide: StreamMetadataFacadeService,
          useClass: StreamMetadataFacadeStub,
        },
      ],
    });

    effects = TestBed.inject<PlayerEffects>(PlayerEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
