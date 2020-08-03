import { Injectable } from '@angular/core';
import { BehaviorSubject, timer, Observable, of } from 'rxjs';
import { switchMap, map, filter, withLatestFrom, share, takeWhile, takeUntil, startWith } from 'rxjs/operators';
import { CurrentTimeService } from './current-time.service';
import { Actions, ofType } from '@ngrx/effects';
import { NotificationsService } from './notifications/notifications.service';
import { PlayerActions } from '../store/player';
import dayjs from 'dayjs';

@Injectable({ providedIn: 'root' })
export class SleepTimerService {
  private sleepTime = new BehaviorSubject<number>(null);

  public stopTimerOnAudioPaused$: Observable<void> = this.actions$.pipe(
    ofType(PlayerActions.audioPaused),
    withLatestFrom(this.sleepTime),
    filter(([, sleepTime]) => this.msUntilSleep(sleepTime) != null),
    map(() => null)
  );
  public sleepTimer$: Observable<void> = this.sleepTime.pipe(
    map(sleepTime => this.msUntilSleep(sleepTime)),
    filter(msUntilSleep => msUntilSleep != null),
    switchMap(msUntilSleep => timer(msUntilSleep).pipe(
      // Cancel when sleepTime is cleared
      takeUntil(this.sleepTime.pipe(filter(st => st == null)))
    )),
    map(() => null),
    share(),
  );
  public minutesToSleep$ = this.sleepTime.pipe(
    map(sleepTime => this.msUntilSleep(sleepTime)),
    switchMap(msUntilSleep => {
      if (msUntilSleep == null) {
        return of(null);
      }
      const initialFullMinutesRemaining = Math.floor(msUntilSleep / 60000);
      const remainder = msUntilSleep % 60000;

      // Emit the minutes remaining once-per-minute until sleepTime
      const countdown = timer(remainder, 60000).pipe(
        map(iteration => initialFullMinutesRemaining - iteration - 1),
        takeWhile(minutesRemaining => minutesRemaining >= -1),
        map(remaining => remaining >= 0 ? remaining : null)
      );
      // Include a starting value if time remains before the next full minute mark
      return remainder > 0
        ? countdown.pipe(startWith(initialFullMinutesRemaining))
        : countdown;
    }),
    share()
  );

  constructor(
    private actions$: Actions,
    private currentTimeService: CurrentTimeService,
    private notificationsService: NotificationsService,
  ) {
    this.sleepTimer$.subscribe(() => this.onGoToSleep());
    this.stopTimerOnAudioPaused$.subscribe(() => this.clearSleepTimer());
  }

  private msUntilSleep(sleepTime: number): number {
    const currentTime = this.currentTimeService.unix();
    return sleepTime != null && currentTime < sleepTime
      ? sleepTime - currentTime
      : null;
  }

  public setTimer(minutesUntilSleep: number) {
    const sleepTimeInMs = this.currentTimeService.unix() + (minutesUntilSleep * 60000);
    const prettyTime = dayjs(sleepTimeInMs).format('h:mm:ssa');

    this.sleepTime.next(sleepTimeInMs);
    this.notificationsService.success('Sleep Timer Set', `Sleep timer set for ${prettyTime}.`);
  }

  public clearSleepTimer() {
    this.sleepTime.next(null);
    this.notificationsService.success('Sleep Timer Cleared', 'Sleep timer cleared.');
  }

  private onGoToSleep() {
    this.notificationsService.info('Going to sleep', 'Good night!');
  }
}
