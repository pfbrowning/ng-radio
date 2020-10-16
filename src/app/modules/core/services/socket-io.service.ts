import { Injectable } from '@angular/core';
import { ConfigService } from './config/config.service';
import { Observable, fromEvent, merge, defer } from 'rxjs';
import {
    take,
    switchMap,
    tap,
    map,
    shareReplay,
    filter,
    withLatestFrom,
} from 'rxjs/operators';
import { AuthenticationFacadeService } from '../store/authentication/authentication-facade.service';
import { LoggingService } from './logging/logging.service';
import io from 'socket.io-client';

@Injectable({ providedIn: 'root' })
export class SocketIOService {
    private socket = io({ autoConnect: false });

    private disconnect$: Observable<string> = fromEvent(
        this.socket,
        'disconnect'
    );
    private connect$ = fromEvent(this.socket, 'connect');
    private unauthorized$ = fromEvent(this.socket, 'unauthorized');
    private authenticateOnConnect$ = this.connect$.pipe(
        withLatestFrom(this.authenticationFacade.accessToken$),
        tap(([, token]) => {
            this.loggingService.info(
                'Connected to Socket.IO, Authenticating...'
            );
            this.socket.emit('authenticate', { token });
        }),
        switchMap(() =>
            merge(
                this.socketInitialized$.pipe(map(() => true)),
                this.unauthorized$.pipe(map(() => false))
            ).pipe(take(1))
        )
    );
    private initializeOnce$ = defer(() => this.initialize()).pipe(
        shareReplay(1)
    );

    public metadataReceived$: Observable<{
        url: string;
        title: string;
    }> = fromEvent(this.socket, 'metadata');
    public serverDisconnect$ = this.disconnect$.pipe(
        filter((reason) => reason === 'io server disconnect')
    );
    public socketInitialized$ = fromEvent(this.socket, 'socketInitialized');

    constructor(
        private configService: ConfigService,
        private authenticationFacade: AuthenticationFacadeService,
        private loggingService: LoggingService
    ) {
        this.authenticateOnConnect$.subscribe((authenticated) =>
            this.loggingService.info(
                `Authentication ${authenticated ? 'Succeeded' : 'Failed'}`
            )
        );
        this.disconnect$.subscribe((reason) =>
            this.loggingService.info('Disconnected', { reason })
        );
    }

    private initialize() {
        return this.configService.appConfig$.pipe(
            tap(({ radioProxyUrl }) => (this.socket.io.uri = radioProxyUrl))
        );
    }

    public emit(event: string, ...args: any[]): Observable<void> {
        return this.initializeOnce$.pipe(
            switchMap(() => this.connect()),
            tap(() => {
                this.loggingService.debug('Sending', { event, args });
                this.socket.emit(event, ...args);
            }),
            map(() => null)
        );
    }

    public connect(): Observable<void> {
        return this.initializeOnce$.pipe(
            tap(() => {
                if (!this.socket.connected) {
                    this.loggingService.info('Connecting To Socket.IO');
                    this.socket.connect();
                }
            }),
            map(() => null)
        );
    }
}
