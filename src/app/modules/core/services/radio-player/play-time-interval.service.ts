import { Injectable } from '@angular/core';
import { NEVER, Observable, timer } from 'rxjs';
import { share, switchMap } from 'rxjs/operators';
import { PlayerFacadeService } from '../../store/player/player-facade.service';

@Injectable({ providedIn: 'root' })
export class PlayTimeIntervalService {
  constructor(private playerFacade: PlayerFacadeService) {}

  private oneMinuteInMs = 60 * 1000;

  /**
   * Emits the number of minutes that we've been playing audio once per minute while play is in progress.
   *
   * The initial intent for this is so that we can ping the Heroku app every 25 minutes to keep it awake
   * while playing, but I also foresee that this could be useful for things like:
   * * Logging usage telemetry
   * * UX: we could show a toaster with play time every X minutes, or an icon with play time in the toolbar
   */
  public playTimeInMinutes$: Observable<number> = this.playerFacade.isAudioPlaying$.pipe(
    switchMap(isPlaying => {
      if (isPlaying) {
        return timer(0, this.oneMinuteInMs);
      }
      return NEVER;
    }),
    share()
  );
}
