import { Injectable } from '@angular/core';
import { CurrentTimeService } from '@core';
import { PlayerStatus } from '@core/models/player';
import { PlayerFacadeService } from '@core/store';
import { merge, NEVER, Observable, of, timer } from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  filter,
  map,
  share,
  switchMap,
  tap,
} from 'rxjs/operators';
import { PlayTimeIntervalService } from './play-time-interval.service';
import { ProxyKeyService } from './proxy-key.service';

@Injectable({ providedIn: 'root' })
export class RadioProxyPingerService {
  constructor(
    private playTimeIntervalService: PlayTimeIntervalService,
    private proxyKeyService: ProxyKeyService,
    private currentTimeService: CurrentTimeService
  ) {}

  public initialize() {
    this.pingRadioProxyOnInterval$.subscribe();
  }

  public startPing$ = this.playTimeIntervalService.playTimeInMinutes$.pipe(
    filter(playTime => playTime % 25 === 0),
    map(() => ({ pingStartTime: this.currentTimeService.unixMs() }))
  );

  private pingRadioProxyOnInterval$ = this.startPing$.pipe(
    switchMap(({ pingStartTime }) =>
      this.proxyKeyService.fetchNew().pipe(
        map(() => ({ successful: true, error: null, pingStartTime })),
        catchError(error => of({ successful: false, error, pingStartTime }))
      )
    ),
    map(({ successful, error, pingStartTime }) => {
      const pingEndTime = this.currentTimeService.unixMs();
      const pingDuration = pingEndTime - pingStartTime;
      return {
        successful,
        error,
        pingDuration,
      };
    }),
    share()
  );
}
