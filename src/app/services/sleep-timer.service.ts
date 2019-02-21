import { Injectable, Output, EventEmitter } from '@angular/core';
import { Subscription, timer, ReplaySubject, BehaviorSubject, interval } from 'rxjs';
import * as moment from 'moment';
import { NotificationService, Severities } from './notification.service';

@Injectable({providedIn: 'root'})
export class SleepTimerService {
  constructor(private notificationService: NotificationService) {}

  private sleepTimerSubscription: Subscription;
  private minuteInterval: Subscription;
  private sleepTime: moment.Moment;
  public minutesUntilSleep$ = new BehaviorSubject<number>(null);
  @Output() sleep = new EventEmitter<void>();

  private get minutesUntilSleep() : number {
    if(this.sleepTime != null) {
      return this.sleepTime.diff(moment(), 'minutes');
    }
    return null;
  }

  public setTimer(minutes: number) : void {
    // Clear the subscription & date from any previous timers
    this.clearTimer();
    // Set the sleepTime to the specified number of minutes from the current date
    this.sleepTime = moment().add(minutes, 'minutes');
    // Call goToSleep in the specified number of minutes
    this.sleepTimerSubscription = timer(minutes * 60000).subscribe(() => this.goToSleep());
    /* Wait 1 ms so that we're not still at the very start of the interval (we want the first value 
    emitted to be minutes - 1 rather than minutes), then update minutesUntilSleep$ once each minute. */
    this.minuteInterval = timer(1, 60000).subscribe(() => this.minutesUntilSleep$.next(this.minutesUntilSleep));
    // Notify the user that the sleep timer has been set.
    this.notificationService.notify(Severities.Success, 'Sleep Timer Set', `Sleep timer set for ${this.sleepTime.format('h:mm:ss a')}.`);
  }

  public cancelTimer(): void {
    // Clear the subscription & date, then notify the user that the timer has been cancelled.
    this.clearTimer();
    this.notificationService.notify(Severities.Success, 'Sleep Timer Cancelled', `Sleep timer cancelled.`);
  }

  private clearTimer() : void {
    // Unsubscribe and clear everything without performing any notifications or emitting any events
    if(this.sleepTimerSubscription) this.sleepTimerSubscription.unsubscribe();
    if(this.minuteInterval) this.minuteInterval.unsubscribe();
    this.sleepTime = null;
    this.minutesUntilSleep$.next(null);
  }

  private goToSleep() : void {
    // Clear out the timer
    this.clearTimer();
    // Emit the actual sleep event
    this.sleep.emit();
    // Notify the user that we're going to sleep
    this.notificationService.notify(Severities.Info, 'Going to sleep', 'Good night!');
  }
}