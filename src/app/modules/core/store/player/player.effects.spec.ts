import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { PlayerEffects } from './player.effects';
import { provideMockStore } from '@ngrx/store/testing';
import { StreamInfoService, AudioElementToken, NotificationService, ConfigService } from '@core';
import { createStreamInfoServiceSpy, AudioElementStub, createConfigServiceSpy, createNotificationServiceSpy } from '@core/testing';
import { initialRootState } from '../../models/initial-root-state';

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
      ]
    });

    effects = TestBed.inject<PlayerEffects>(PlayerEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
