import { Injectable } from '@angular/core';
import { CurrentTimeService } from '@core';
import { of } from 'rxjs';
import { catchError, filter, map, share, switchMap } from 'rxjs/operators';
import { PlayTimeIntervalService } from './play-time-interval.service';
import { ProxyKeyService } from './proxy-key.service';

/**
 * This service performs an HTTP request to the Radio Proxy service on 25 minute intervals
 * during audio play.
 *
 * This is necessary because the free version of the Heroku app goes to sleep after 30 minutes of
 * "inactivity" with no HTTP requests logged, even if we're still in the process of streaming audio.
 * As a result the audio stream itself is killed after 30 minutes unless we keep performing HTTP requests.
 */
@Injectable({ providedIn: 'root' })
export class RadioProxyPingerService {
  constructor(
    private playTimeIntervalService: PlayTimeIntervalService,
    private proxyKeyService: ProxyKeyService,
    private currentTimeService: CurrentTimeService
  ) {}

  private pingIntervalInMinutes = 25;

  public initialize = () => this.pingRadioProxyOnInterval$.subscribe();

  public startPing$ = this.playTimeIntervalService.playTimeInMinutes$.pipe(
    filter(playTime => playTime > 0 && playTime % this.pingIntervalInMinutes === 0),
    map(() => ({ pingStartTime: this.currentTimeService.unixMs() }))
  );

  public pingRadioProxyOnInterval$ = this.startPing$.pipe(
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

  public pingSucceeded$ = this.pingRadioProxyOnInterval$.pipe(
    filter(result => result.successful),
    map(({ pingDuration }) => ({ pingDuration }))
  );

  public pingFailed$ = this.pingRadioProxyOnInterval$.pipe(
    filter(result => !result.successful),
    map(({ error, pingDuration }) => ({ error, pingDuration }))
  );
}
