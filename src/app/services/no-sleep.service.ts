import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as NoSleep from 'nosleep.js';
import { PlayerService } from './player.service';

@Injectable({providedIn: 'root'})
export class NoSleepService {
  constructor(private playerService: PlayerService) {
    // Disable nosleep when the audio stops, regardless of why
    this.playerService.audioPaused.subscribe(() => this.disable());
  }

  private noSleep = new NoSleep();
  public enabled$ = new BehaviorSubject<boolean>(false);

  public enable(): void {
    this.noSleep.enable();
    this.enabled$.next(true);
  }

  public disable(): void {
    this.noSleep.disable();
    this.enabled$.next(false);
  }
}