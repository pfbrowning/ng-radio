import { Injectable } from '@angular/core';
import { ConfigService } from '../config/config.service';
import { ProxyKeyService } from './proxy-key.service';
import { AudioElementService } from './audio-element.service';
import { forkJoin, of } from 'rxjs';
import { tap, switchMap, timeout, map, catchError } from 'rxjs/operators';
import { ValidateStreamResult } from '../../models/player/validate-stream-result';

@Injectable({
    providedIn: 'root',
})
export class AudioProxyService {
    constructor(
        private configService: ConfigService,
        private proxyKeyService: ProxyKeyService,
        private audioElementService: AudioElementService
    ) {}

    private loadAudio = (streamUrl: string) =>
        forkJoin([
            this.configService.appConfig$,
            this.proxyKeyService.fetchNew(),
        ]).pipe(
            tap(([{ radioProxyUrl }, proxyKey]) => {
                const url = new URL(`${radioProxyUrl}/stream`);
                url.searchParams.append('url', streamUrl);
                url.searchParams.append('key', proxyKey);
                this.audioElementService.src = url.toString();
            }),
            switchMap(() => this.audioElementService.play())
        );

    public play = (streamUrl: string) =>
        of(null).pipe(
            tap(() => (this.audioElementService.muted = false)),
            switchMap(() => this.loadAudio(streamUrl))
        );

    public validate = (streamUrl: string) =>
        of(null).pipe(
            tap(() => (this.audioElementService.muted = true)),
            switchMap(() => this.loadAudio(streamUrl)),
            timeout(10000),
            tap(() => {
                this.audioElementService.pause();
                this.audioElementService.src = '';
            }),
            map((): ValidateStreamResult => ({ success: true })),
            catchError(error =>
                of<ValidateStreamResult>({ success: false, error })
            )
        );
}
