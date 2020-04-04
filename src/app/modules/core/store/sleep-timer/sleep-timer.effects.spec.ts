import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { SleepTimerEffects } from './sleep-timer.effects';
import { provideMockStore } from '@ngrx/store/testing';
import { CurrentTimeService, NotificationService } from '@core';
import { createCurrentTimeServiceSpy, createNotificationServiceSpy } from '@core/testing';
import { initialRootState } from '../../models/initial-root-state';

describe('SleepTimerEffects', () => {
  const actions$: Observable<any> = null;
  let effects: SleepTimerEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SleepTimerEffects,
        provideMockActions(() => actions$),
        provideMockStore({initialState: initialRootState }),
        { provide: NotificationService, useValue: createNotificationServiceSpy() },
        { provide: CurrentTimeService, useValue: createCurrentTimeServiceSpy() }
      ]
    });

    effects = TestBed.inject<SleepTimerEffects>(SleepTimerEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
