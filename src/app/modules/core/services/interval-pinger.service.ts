import { Injectable } from '@angular/core';
import { PlayerStatus } from '@core/models/player';
import { PlayerFacadeService } from '@core/store';
import { NEVER, Observable, timer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { PingResult } from '../models/interval-pinger/ping-result';
import { PingResultStatus } from '../models/interval-pinger/ping-result-status';
import { ProxyKeyService } from './radio-player/proxy-key.service';

@Injectable({ providedIn: 'root' })
export class IntervalPingerService {
  constructor(private playerFacade: PlayerFacadeService, private proxyKeyService: ProxyKeyService) {
    // this.pingRadioProxyOnIntervalWhilePlaying$.subscribe();
  }

  private twentyFiveMinutesInMs = 25 * 60 * 1000;

  public pingRadioProxyOnIntervalWhilePlaying$: Observable<PingResult> =
    this.playerFacade.playerStatus$.pipe(
      switchMap(playerStatus =>
        playerStatus === PlayerStatus.Playing
          ? timer(this.twentyFiveMinutesInMs, this.twentyFiveMinutesInMs).pipe(
              switchMap(() =>
                this.proxyKeyService
                  .fetchNew()
                  .pipe(map((): PingResult => ({ status: PingResultStatus.Success })))
              )
            )
          : NEVER
      )
    );
}
