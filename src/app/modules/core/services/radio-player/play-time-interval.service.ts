import { Injectable } from '@angular/core';
import { NEVER, Observable, timer } from 'rxjs';
import { map, share, switchMap } from 'rxjs/operators';
import { PlayerFacadeService } from '../../store/player/player-facade.service';

@Injectable({ providedIn: 'root' })
export class PlayTimeIntervalService {
  constructor(private playerFacade: PlayerFacadeService) {}

  private oneMinuteInMs = 60 * 1000;

  public playTimeInMinutes$: Observable<number> = this.playerFacade.isAudioPlaying$.pipe(
    switchMap(isPlaying => {
      if (isPlaying) {
        return timer(this.oneMinuteInMs, this.oneMinuteInMs).pipe(map(sequence => sequence + 1));
      }
      return NEVER;
    }),
    share()
  );
}
