import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { PlayerEffects } from './player.effects';
import { provideMockStore } from '@ngrx/store/testing';
import { StreamInfoService, NotificationService, ConfigService } from '@core';
import { initialRootState } from '../../models/initial-root-state';
import { AudioElementToken } from '../../injection-tokens/audio-element-token';
import { CurrentTimeService } from '../../services/current-time.service';
import { LoggingService } from '../../services/logging.service';
import { createLoggingServiceSpy, createStreamPreprocessorServiceSpy } from '../../testing/core-spy-factories.spec';
import { StreamPreprocessorService } from '../../services/preprocessing/stream-preprocessor.service';
import { CoreSpyFactories } from '@core/testing';
import { AudioElementStub } from '../../testing/AudioElementStub.spec';

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
        { provide: NotificationService, useValue: CoreSpyFactories.createNotificationServiceSpy() },
        { provide: StreamInfoService, useValue: CoreSpyFactories.createStreamInfoServiceSpy() },
        { provide: ConfigService, useValue: CoreSpyFactories.createConfigServiceSpy() },
        { provide: AudioElementToken, useValue: audioElement },
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
