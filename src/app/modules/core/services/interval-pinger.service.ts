import { Injectable } from '@angular/core';
import { CurrentTimeService } from '@core';
import { PlayerStatus } from '@core/models/player';
import { PlayerFacadeService } from '@core/store';
import { merge, NEVER, Observable, of, timer } from 'rxjs';
import { catchError, distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';
import { LoggingService } from '.';
import { PingResult } from '../models/interval-pinger/ping-result';
import { PingResultStatus } from '../models/interval-pinger/ping-result-status';
import { ProxyKeyService } from './radio-player/proxy-key.service';

@Injectable({ providedIn: 'root' })
export class IntervalPingerService {
  constructor(
    private playerFacade: PlayerFacadeService,
    private proxyKeyService: ProxyKeyService,
    private currentTimeService: CurrentTimeService,
    private loggingService: LoggingService
  ) {
    this.startPing$.subscribe(details => this.loggingService.info('Starting Ping', details));
    this.pingSucceeded$.subscribe(details => this.loggingService.info('Ping Succeeded', details));
    this.pingFailed$.subscribe(details => this.loggingService.warn('Ping Failed', details));
  }

  private pingInterval = 25 * 60 * 1000;

  private isAudioPlaying$ = this.playerFacade.playerStatus$.pipe(
    map(status => status === PlayerStatus.Playing),
    distinctUntilChanged()
  );

  private playTimeInterval$ = this.isAudioPlaying$.pipe(
    switchMap(isPlaying => {
      if (isPlaying) {
        const playStartTime = this.currentTimeService.unixMs();
        return timer(this.pingInterval, this.pingInterval).pipe(
          map(() => {
            const intervalTime = this.currentTimeService.unixMs();
            const playDuration = intervalTime - playStartTime;
            return { playStartTime, intervalTime, playDuration };
          })
        );
      }
      return NEVER;
    })
  );

  private startPing$ = this.playTimeInterval$.pipe(
    map(() => ({ pingStartTime: this.currentTimeService.unixMs() }))
  );

  private pingRadioProxy$ = this.startPing$.pipe(
    switchMap(({ pingStartTime }) =>
      this.proxyKeyService.fetchNew().pipe(
        map(() => ({ successful: true, pingStartTime })),
        catchError(() => of({ successful: false, pingStartTime }))
      )
    ),
    map(({ successful, pingStartTime }) => {
      const pingEndTime = this.currentTimeService.unixMs();
      const pingDuration = pingEndTime - pingStartTime;
      return {
        successful,
        pingStartTime,
        pingEndTime,
        pingDuration,
      };
    })
  );

  private pingSucceeded$ = this.pingRadioProxy$.pipe(filter(result => result.successful));

  private pingFailed$ = this.pingRadioProxy$.pipe(filter(result => !result.successful));

  private pingFinalized$ = merge(this.pingSucceeded$, this.pingFailed$);

  private pingInProgress$ = merge(
    this.startPing$.pipe(map(() => true)),
    this.pingFinalized$.pipe(map(() => false))
  );
}
