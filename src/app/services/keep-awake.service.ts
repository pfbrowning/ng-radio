import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NoSleepToken } from '../injection-tokens/no-sleep-token';
import { AudioElement } from '../models/audio-element';
import { AudioElementToken } from '../injection-tokens/audio-element-token';
import { NotificationService, Severities } from './notification.service';
import * as NoSleep from 'nosleep.js';

/** Manages NoSleep.js, which keeps mobile screens awake by playing a hidden
 * video in the background. */
@Injectable({providedIn: 'root'})
export class KeepAwakeService {
  constructor(
    private notificationService: NotificationService,
    @Inject(AudioElementToken) private audio: AudioElement,
    @Inject(NoSleepToken) private noSleep: NoSleep) {
    // Disable nosleep when the audio stops, regardless of why
    this.audio.paused.subscribe(() => this.disable());
  }

  /* Expose the current state at any given time with a
  BehaviorSubject for component template binding. */
  public enabled$ = new BehaviorSubject<boolean>(false);

  public enable(): void {
    // Enable the nosleep object itself
    this.noSleep.enable();
    // Notify any subscribers
    this.enabled$.next(true);
    this.notificationService.notify(Severities.Success, 'Keep Awake Enabled',
      'Keep Awake has been enabled.  This should keep the screen from locking when used on mobile devices.');
  }

  public disable(): void {
    // Disable the nosleep object
    this.noSleep.disable();
    // Notify any subscribers
    this.enabled$.next(false);
    this.notificationService.notify(Severities.Success, 'Keep Awake Disabled',
      'Keep Awake has been disabled.');
  }
}
