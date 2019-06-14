import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NoSleepToken } from '../injection-tokens/no-sleep-token';
import { AudioElement, AudioElementToken } from '@modules/core/core-radio-logic/core-radio-logic.module';
import { NotificationService, Severities } from '@modules/core/notifications/notifications.module';
import * as NoSleep from 'nosleep.js';

/** Manages NoSleep.js, which keeps mobile screens awake by playing a hidden
 * video in the background. */
@Injectable()
export class KeepAwakeService {
  constructor(
    private notificationService: NotificationService,
    @Inject(AudioElementToken) private audio: AudioElement,
    @Inject(NoSleepToken) private noSleep: NoSleep) {
    // Disable nosleep when the audio stops, regardless of why
    this.audio.paused.subscribe(() => this.disable());
  }

  private enabled = new BehaviorSubject<boolean>(false);
  /** Reports to subscribers the state of whether noSleep.js is
   * enabled or not at any given time. */
  public enabled$ = this.enabled.asObservable();

  /** Enables NoSleep.js in order to keep the mobile screen
   * from going to sleep. */
  public enable(): void {
    // Enable the nosleep object itself
    this.noSleep.enable();
    // Notify any subscribers
    this.enabled.next(true);
    this.notificationService.notify(Severities.Success, 'Keep Awake Enabled',
      'Keep Awake has been enabled.  This should keep the screen from locking when used on mobile devices.');
  }

  /** Disables NoSleep.js in order to allow the mobile screen
   * to go to sleep regularly. */
  public disable(): void {
    // If the nosleep object is currently enabled
    if (this.enabled.value === true) {
      // Disable it
      this.noSleep.disable();
      // Notify any subscribers
      this.enabled.next(false);
      this.notificationService.notify(Severities.Success, 'Keep Awake Disabled',
        'Keep Awake has been disabled.');
    }
  }

  /** Toggles the state of whether NoSleep.js is enabled */
  public toggle(): void {
    if (this.enabled.value) {
      this.disable();
    } else {
      this.enable();
    }
  }
}
