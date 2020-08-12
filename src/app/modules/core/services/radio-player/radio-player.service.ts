import { Injectable } from '@angular/core';
import { ProxyKeyService } from './proxy-key.service';
import { AudioElementService } from './audio-element.service';
import { Observable, forkJoin } from 'rxjs';
import { ConfigService } from '../config/config.service';
import { tap, switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class RadioPlayerService {
  constructor(
    private configService: ConfigService,
    private proxyKeyService: ProxyKeyService,
    private audioElementService: AudioElementService
  ) { }

  public play(streamUrl: string): Observable<void> {
    return forkJoin([
      this.configService.appConfig$,
      this.proxyKeyService.fetchNew()
    ]).pipe(
      tap(([{radioProxyUrl}, proxyKey]) => {
        const url = new URL(`${radioProxyUrl}/stream`);
        url.searchParams.append('url', streamUrl);
        url.searchParams.append('key', proxyKey);
        this.audioElementService.src = url.toString();
      }),
      switchMap(() => this.audioElementService.play())
    );
  }
}
