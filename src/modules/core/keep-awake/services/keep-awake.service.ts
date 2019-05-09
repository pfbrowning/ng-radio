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
  public enabled$ = this.enabled.asObservable();

  public enable(): void {
    // Enable the nosleep object itself
    this.noSleep.enable();
    // Notify any subscribers
    this.enabled.next(true);
    this.notificationService.notify(Severities.Success, 'Keep Awake Enabled',
      'Keep Awake has been enabled.  This should keep the screen from locking when used on mobile devices.');
  }

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

  public toggle(): void {
    if (this.enabled.value) {
      this.disable();
    } else {
      this.enable();
    }
  }
}
