import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { PlayerEffects } from './player.effects';
import { provideMockStore } from '@ngrx/store/testing';
import { StreamInfoService, NotificationService, ConfigService } from '@core';
import { initialRootState } from '../../models/initial-root-state';
import { AudioElementToken } from '../../injection-tokens/audio-element-token';
import {
  createStreamInfoServiceSpy,
  AudioElementStub,
  createConfigServiceSpy,
  createNotificationServiceSpy,
  createCurrentTimeServiceSpy
} from '@core/testing';
import { CurrentTimeService } from '../../services/current-time.service';
import { LoggingService } from '../../services/logging.service';
import { createLoggingServiceSpy, createStreamValidatorServiceSpy } from '../../testing/core-spy-factories.spec';
import { StreamValidatorService } from '../../services/player/stream-validator.service';

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
        { provide: NotificationService, useValue: createNotificationServiceSpy() },
        { provide: StreamInfoService, useValue: createStreamInfoServiceSpy() },
        { provide: ConfigService, useValue: createConfigServiceSpy() },
        { provide: AudioElementToken, useValue: audioElement },
        { provide: CurrentTimeService, useValue: createCurrentTimeServiceSpy() },
        { provide: LoggingService, useValue: createLoggingServiceSpy() },
        { provide: StreamValidatorService, useValue: createStreamValidatorServiceSpy() }
      ]
    });

    effects = TestBed.inject<PlayerEffects>(PlayerEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
