import { Injectable } from '@angular/core';
import { Observable, fromEvent, merge, ReplaySubject } from 'rxjs';
import { take, switchMap, tap, map, withLatestFrom } from 'rxjs/operators';
import { io } from 'socket.io-client';
import { AppConfig } from '../models/config/app-config';
import { ConfigProviderService } from './config/config-provider.service';

@Injectable({ providedIn: 'root' })
export class SocketIOService {
  private socket;

  private createStreamFromSocketEvent<T>(event: string): Observable<T> {
    return this.socketReferenceInitialized$.pipe(switchMap(() => fromEvent<T>(this.socket, event)));
  }

  private socketReferenceInitialized$ = new ReplaySubject<void>(1);

  public authenticate = (accessToken: string) =>
    this.socket.emit('authenticate', { token: accessToken });

  public setStreams = (streams: string[]) => this.socket.emit('setStreams', streams);
  public connect = () => this.socket.connect();

  // TODO map each of these events to an NGRX action
  private disconnected$ = this.createStreamFromSocketEvent<string>('disconnect');
  private connected$ = this.createStreamFromSocketEvent<void>('connect');
  private unauthorized$ = this.createStreamFromSocketEvent<void>('unauthorized');
  private socketInitializedServerside$ = this.createStreamFromSocketEvent<void>(
    'socketInitializedServerside'
  );

  // TODO abstract this 'url' and 'title' object type behind a DTO model and map this to an NGRX action
  public metadataReceived$ = this.createStreamFromSocketEvent<{
    url: string;
    title: string;
  }>('metadata');

  // TODO move this piece to effects
  private authenticateOnConnect$ = this.connected$.pipe(
    withLatestFrom(this.authenticationFacade.accessToken$),
    tap(([, token]) => this.authenticate(token)),
    switchMap(() =>
      merge(
        this.socketInitializedServerside$.pipe(map(() => true)),
        this.unauthorized$.pipe(map(() => false))
      ).pipe(take(1))
    )
  );

  constructor(private configProvider: ConfigProviderService) {
    // TODO should we call this from the constructor or from the effects?
    this.configProvider.getConfigOnceLoaded().subscribe(config => this.initialize(config));
  }

  private initialize(config: AppConfig): void {
    this.socket = io(config.radioProxyUrl, { autoConnect: false });
    this.socketReferenceInitialized$.next();
    // TODO do we need to call connect here??
  }
}
