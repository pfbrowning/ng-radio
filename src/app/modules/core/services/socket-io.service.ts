import { Injectable } from '@angular/core';
import { ConfigService } from './config/config.service';
import { Observable, Observer, ReplaySubject, Subject, fromEvent, combineLatest, forkJoin, merge, throwError, defer, BehaviorSubject } from 'rxjs';
import { take, switchMap, tap, map, shareReplay, filter } from 'rxjs/operators';
import { AuthenticationFacadeService } from '../store/authentication/authentication-facade.service';
import io from 'socket.io-client';

@Injectable({ providedIn: 'root' })
export class SocketIOService {
  private socket = io({
    autoConnect: false,
    reconnectionAttempts: 10
  });
  
  // TODO Decide whether to set urls again on reconnect or persist state on server
  // TODO Decide how to abstract away the complexity of reconnecting to socket.io
  // TODO Link server state with access token's sub
  // TODO Figure out client disconnect reconnect
  // TODO Handle reconnect failure
  // TODO What happens if we can't connect at all?
  // TODO Should we be emitting a wildcard for custom events?
  public metadataReceived$ = fromEvent(this.socket, 'metadata').pipe(
    map(([url, title]) => ({url, title})),
  )
  public serverDisconnect$ = fromEvent(this.socket, 'disconnect').pipe(
    filter(reason => reason === 'io server disconnect')
  );
  public nonServerDisconnect$ = fromEvent(this.socket, 'disconnect').pipe(
    filter(reason => reason !== 'io server disconnect')
  );
  public connect$ = fromEvent(this.socket, 'connect');
  public userInitialized$ = fromEvent(this.socket, 'userInitialized');
  public unauthorized$ = fromEvent(this.socket, 'unauthorized');
  public reconnecting$ = fromEvent(this.socket, 'reconnecting');
  public reconnectFailed$ = fromEvent(this.socket, 'reconnect_failed');

  constructor() {
    this.socket.on('disconnect', a => console.log('disconnect', a));
    this.socket.on('connect', a => console.log('connect', a));
    this.socket.on('reconnect', a => console.log('reconnect'));
    this.socket.on('unauthorized', a => console.log('unauthorized', a));
    this.socket.on('userInitialized', a => console.log('userInitialized', a));
    this.socket.on('authorized', a => console.log('authorized', a));
  }

  public initialize(radioProxyUrl: string) {
    this.socket.io.uri = radioProxyUrl;
    this.socket.connect();
  }

  public authenticate(token: string) {
    console.log('authenticating', token);
    this.socket.emit('authenticate', { token });
  }

  public sendAndWait(event: string, ...args: any[]): Observable<void> {
    console.log('send and wait', event, args);
    return Observable.create((observer: Observer<void>) => {
      console.log('emitting');
      this.socket.emit(event, ...args, () => {
        console.log('ack');
        observer.next();
        observer.complete();
      });
    });
  }

  public reconnect(): void {
    console.log('reconnecting manually');
    this.socket.connect();
  }
}
