import { Injectable, Output, EventEmitter } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import * as moment from 'moment';
import { NotificationService, Severities } from './notification.service';

@Injectable({providedIn: 'root'})
export class SleepTimerService {
  constructor(private notificationService: NotificationService) {}

  private sleepTimerSubscription: Subscription;
  private _sleepTime: moment.Moment;
  @Output() sleep = new EventEmitter<void>();
  @Output() timerCancelled = new EventEmitter<void>();
  @Output() timerSet = new EventEmitter<moment.Moment>();

  public get sleepTime() : moment.Moment {
    return this._sleepTime;
  }

  public get minutesUntilSleep() : number {
    if(this.sleepTime != null) {
      return this.sleepTime.diff(moment(), 'minutes');
    }
    return null;
  }

  public setTimer(minutes: number) : void {
    this.clearTimer();
    this._sleepTime = moment().add(minutes, 'minutes');
    this.sleepTimerSubscription = timer(minutes * 60000).subscribe(() => this.goToSleep());
    this.timerSet.emit(this.sleepTime);
    this.notificationService.notify(Severities.Success, 'Sleep Timer Set', `Sleep timer set for ${this.sleepTime.toString()}.`);
  }

  public cancelTimer(): void {
    this.clearTimer();
    this.timerCancelled.emit();
    this.notificationService.notify(Severities.Success, 'Sleep Timer Cancelled', `Sleep timer cancelled.`);
  }

  private clearTimer() : void {
    if(this.sleepTimerSubscription) this.sleepTimerSubscription.unsubscribe();
    this._sleepTime = null;
  }

  private goToSleep() : void {
    this.clearTimer();
    this.sleep.emit();
    this.notificationService.notify(Severities.Info, 'Going to sleep', 'Good night!');
  }
}