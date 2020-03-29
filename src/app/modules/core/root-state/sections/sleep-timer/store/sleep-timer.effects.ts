import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CurrentTimeService } from '@core';
import { tap, map, switchMap, takeUntil, mapTo, withLatestFrom } from 'rxjs/operators';
import { timer, of } from 'rxjs';
import { NotificationService, Severities } from '@notifications';
import { RootState } from '../../../models/root-state';
import { Store, select } from '@ngrx/store';
import { selectSleepTime } from './sleep-timer.selectors';
import { setSleepTimerSubmit, sleepTimerSet, clearSleepTimer, goToSleep, setMinutesUntilSleep, countMinutesUntilSleep } from './sleep-timer.actions';
import * as dayjs from 'dayjs';

@Injectable()
export class SleepTimerEffects {
  constructor(
    private actions$: Actions,
    private store: Store<RootState>,
    private notificationService: NotificationService,
    private currentTimeService: CurrentTimeService
  ) {}

  setSleepTimer$ = createEffect(() => this.actions$.pipe(
    ofType(setSleepTimerSubmit),
    map(action => this.currentTimeService.unix() + (action.minutes * 60000)),
    map(sleepTime => sleepTimerSet({sleepTime}))
  ));

  waitForSleep$ = createEffect(() => this.actions$.pipe(
    ofType(sleepTimerSet),
    map(action => action.sleepTime - this.currentTimeService.unix()),
    switchMap(timeUntilSleep => timer(timeUntilSleep).pipe(
        takeUntil(this.actions$.pipe(ofType(sleepTimerSet, clearSleepTimer))),
        mapTo(goToSleep())
    ))
  ));

  countMinutesUntilSleepOnTimerSet$ = createEffect(() => this.actions$.pipe(
    ofType(sleepTimerSet),
    map(() => countMinutesUntilSleep())
  ));

  countMinutesUntilSleep$ = createEffect(() => this.actions$.pipe(
    ofType(countMinutesUntilSleep),
    withLatestFrom(this.store.pipe(select(selectSleepTime))),
    map(([action, sleepTime]) => Math.floor((sleepTime - this.currentTimeService.unix()) / 60000)),
    map(minutesUntilSleep => setMinutesUntilSleep({minutesUntilSleep}))
  ));

  waitToRecountMinutesUntilSleep$ = createEffect(() => this.actions$.pipe(
    ofType(countMinutesUntilSleep),
    switchMap(action => timer(60000).pipe(
        takeUntil(this.actions$.pipe(ofType(sleepTimerSet, clearSleepTimer, goToSleep))),
        map(() => countMinutesUntilSleep())
    ))
  ));

  notifySleepTimerSet$ = createEffect(() => this.actions$.pipe(
    ofType(sleepTimerSet),
    map(action => dayjs(action.sleepTime).format('h:mm:ssa')),
    tap(time => this.notificationService.notify(Severities.Success, 'Sleep Timer Set', `Sleep timer set for ${time}.`))
  ), { dispatch: false });

  notifySleepTimerCleared$ = createEffect(() => this.actions$.pipe(
    ofType(clearSleepTimer),
    tap(() => this.notificationService.notify(Severities.Success, 'Sleep Timer Cleared', 'Sleep timer cleared.'))
  ), { dispatch: false });

  notifyGoingToSleep$ = createEffect(() => this.actions$.pipe(
    ofType(goToSleep),
    tap(() => this.notificationService.notify(Severities.Info, 'Going to sleep', 'Good night!'))
  ), { dispatch: false });
}
