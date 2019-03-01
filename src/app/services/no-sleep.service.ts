import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PlayerService } from './player.service';
import * as NoSleep from 'nosleep.js';

/** Manages NoSleep.js, which keeps mobile screens awake by playing a hidden
 * video in the background. */
@Injectable({providedIn: 'root'})
export class NoSleepService {
  constructor(private playerService: PlayerService, private noSleep: NoSleep) {
    // Disable nosleep when the audio stops, regardless of why
    this.playerService.audioPaused.subscribe(() => this.disable());
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
