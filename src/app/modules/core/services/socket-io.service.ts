import { Injectable } from '@angular/core';
import { ConfigService } from './config/config.service';
import { Observable, Observer, ReplaySubject, Subject, fromEvent, combineLatest, forkJoin, merge, throwError, defer, BehaviorSubject } from 'rxjs';
import { take, switchMap, tap, map, shareReplay, filter, withLatestFrom } from 'rxjs/operators';
import { AuthenticationFacadeService } from '../store/authentication/authentication-facade.service';
import io from 'socket.io-client';
import { LoggingService } from './logging/logging.service';

@Injectable({ providedIn: 'root' })
export class SocketIOService {
  private socket = io({ autoConnect: false });
  private authenticated = false;
  
  private disconnect$: Observable<string> = fromEvent(this.socket, 'disconnect');
  private connect$ = fromEvent(this.socket, 'connect');
  private unauthorized$ = fromEvent(this.socket, 'unauthorized');
  private authenticateOnConnect$ = this.connect$.pipe(
    withLatestFrom(this.authenticationFacade.accessToken$),
    tap(([, token]) => {
      this.loggingService.info('Connected to Socket.IO, Authenticating...');
      this.socket.emit('authenticate', { token });
    }),
    switchMap(() => merge(
      this.socketInitialized$.pipe(map(() => true)),
      this.unauthorized$.pipe(map(() => false))
    ).pipe(take(1))),
  )
  private initializeOnce$ = defer(() => this.initialize()).pipe(shareReplay(1));

  // TODO Should we be emitting a wildcard for custom events?
  public metadataReceived$ = fromEvent(this.socket, 'metadata').pipe(
    // TODO Should we be emitting this as an object from the server so that we don't have to map it here?
    map(([url, title]) => ({url, title})),
  )
  public serverDisconnect$ = this.disconnect$.pipe(
    filter(reason => reason === 'io server disconnect')
  );
  public socketInitialized$ = fromEvent(this.socket, 'socketInitialized');

  constructor(
    private configService: ConfigService,
    private authenticationFacade: AuthenticationFacadeService,
    private loggingService: LoggingService
  ) {
    this.socket.on('disconnect', a => console.log('disconnect', a));
    this.socket.on('connect', a => console.log('connect', a));
    this.socket.on('reconnect', a => console.log('reconnect'));
    this.socket.on('unauthorized', a => console.log('unauthorized', a));
    this.socket.on('socketInitialized', a => console.log('socketInitialized', a));
    this.authenticateOnConnect$.subscribe(authenticated => {
      this.loggingService.info(`Authentication ${authenticated ? 'Succeeded' : 'Failed'}`);
      this.authenticated = authenticated
    });
    this.disconnect$.subscribe(reason => {
      this.loggingService.info('Disconnected', { reason });
      this.authenticated = false;
    });
  }

  private initialize() {
    return this.configService.appConfig$.pipe(
      tap(({radioProxyUrl}) => this.socket.io.uri = radioProxyUrl)
    );
  }

  public emit(event: string, ...args: any[]) {
    this.initializeOnce$.subscribe(() => {
      this.connect();
      this.loggingService.debug('Sending', { event, args });
      this.socket.emit(event, ...args);
    })
  }

  public connect(): void {
    this.initializeOnce$.subscribe(() => {
      if (!this.socket.connected) {
        this.loggingService.info('Connecting To Socket.IO');
        this.socket.connect();
      }
    })
  }
}
