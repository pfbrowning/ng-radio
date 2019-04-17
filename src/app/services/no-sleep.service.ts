import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NoSleepToken } from '../injection-tokens/no-sleep-token';
import { AudioElement } from '../models/audio-element';
import { AudioElementToken } from '../injection-tokens/audio-element-token';
import * as NoSleep from 'nosleep.js';

/** Manages NoSleep.js, which keeps mobile screens awake by playing a hidden
 * video in the background. */
@Injectable({providedIn: 'root'})
export class NoSleepService {
  constructor(
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
  }

  public disable(): void {
    // Disable the nosleep object
    this.noSleep.disable();
    // Notify any subscribers
    this.enabled$.next(false);
  }
}
