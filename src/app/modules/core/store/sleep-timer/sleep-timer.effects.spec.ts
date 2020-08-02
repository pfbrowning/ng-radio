import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { SleepTimerEffects } from './sleep-timer.effects';
import { provideMockStore } from '@ngrx/store/testing';
import { CurrentTimeService } from '@core';
import { initialRootState } from '../../models/initial-root-state';
import { CoreSpyFactories } from '@core/testing';
import { NotificationService } from '@core/services';

describe('SleepTimerEffects', () => {
  const actions$: Observable<any> = null;
  let effects: SleepTimerEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SleepTimerEffects,
        provideMockActions(() => actions$),
        provideMockStore({initialState: initialRootState }),
        { provide: NotificationService, useValue: CoreSpyFactories.createNotificationServiceSpy() },
        { provide: CurrentTimeService, useValue: CoreSpyFactories.createCurrentTimeServiceSpy() }
      ]
    });

    effects = TestBed.inject<SleepTimerEffects>(SleepTimerEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
