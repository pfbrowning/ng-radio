import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { PlayerEffects } from './player.effects';
import { initialRootState } from '../../../models/initial-root-state';
import { provideMockStore } from '@ngrx/store/testing';
import { NotificationService } from '@notifications';
import { createNotificationServiceSpy } from '@notifications/testing';
import { StreamInfoService, AudioElementToken } from '@core';
import { createStreamInfoServiceSpy, AudioElementStub } from '@core/testing';
import { ConfigService } from '@config';
import { createConfigServiceSpy } from '@config/testing';

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
