import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { SleepTimerEffects } from './sleep-timer.effects';

describe('SleepTimerEffects', () => {
  const actions$: Observable<any> = null;
  let effects: SleepTimerEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SleepTimerEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.inject<SleepTimerEffects>(SleepTimerEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
