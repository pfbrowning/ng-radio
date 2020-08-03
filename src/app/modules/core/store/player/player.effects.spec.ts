import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { PlayerEffects } from './player.effects';
import { provideMockStore } from '@ngrx/store/testing';
import { initialRootState } from '../../models/initial-root-state';
import { CurrentTimeService } from '../../services/current-time.service';
import { createLoggingServiceSpy, createStreamPreprocessorServiceSpy } from '../../testing/core-spy-factories.spec';
import { StreamPreprocessorService } from '../../services/preprocessing/stream-preprocessor.service';
import { CoreSpyFactories } from '@core/testing';
import { AudioElementStub } from '../../testing/AudioElementStub.spec';
import { ConfigStubService } from '../../testing/stubs/config-stub-service.spec';
import { NotificationsService, StreamInfoService, LoggingService, AudioElementService, ConfigService } from '@core/services';

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
        provideMockStore({initialState: initialRootState}),
        { provide: NotificationsService, useValue: CoreSpyFactories.createNotificationsServiceSpy() },
        { provide: StreamInfoService, useValue: CoreSpyFactories.createStreamInfoServiceSpy() },
        { provide: ConfigService, useClass: ConfigStubService },
        { provide: AudioElementService, useValue: audioElement },
        { provide: CurrentTimeService, useValue: CoreSpyFactories.createCurrentTimeServiceSpy() },
        { provide: LoggingService, useValue: createLoggingServiceSpy() },
        { provide: StreamPreprocessorService, useValue: createStreamPreprocessorServiceSpy() }
      ]
    });

    effects = TestBed.inject<PlayerEffects>(PlayerEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
