import { Injectable } from '@angular/core';
import { ConfigService } from './config/config.service';
import { Observable, Observer, ReplaySubject, Subject, fromEvent, combineLatest } from 'rxjs';
import { take, switchMap, tap, map } from 'rxjs/operators';
import { AuthenticationFacadeService } from '../store/authentication/authentication-facade.service';
import io from 'socket.io-client';

@Injectable({ providedIn: 'root' })
export class StreamMetadataService {
  private socket: SocketIOClient.Socket;
  private initializedSource = new ReplaySubject<void>();
  private socketReady$ = this.initializedSource.pipe(take(1));
  
  public metadataReceived$ = this.socketReady$.pipe(
    switchMap(() => fromEvent(this.socket, 'metadata')),
    map(([url, title]) => ({url, title}))
  )

  constructor(private configService: ConfigService, private authenticationFacade: AuthenticationFacadeService) {
    // TODO Abstract the direct Socket.IO logic behind a service
    combineLatest([
      this.configService.appConfig$,
      this.authenticationFacade.accessToken$
    ]).subscribe(([{radioProxyUrl}, token]) => {
      this.socket = io.connect(radioProxyUrl);
      this.socket
        .emit('authenticate', { token })
        .on('clientInitialized', () => {
          console.log('authenticated');
          this.initializedSource.next();
        })
        .on('unauthorized', (msg) => {
          console.log(`unauthorized: ${JSON.stringify(msg.data)}`);
          throw new Error(msg.data.type);
        })

      /* Should we try to automatically reconnect?  Maybe only if there are streamUrls
      in the store? */
      this.socket.on('disconnect', a => console.log('disconnected'));
    });
  }

  public setConnectedStreams(streamUrls: Array<string>): Observable<void> {
    console.log('set streams', streamUrls);
    const obs: Observable<void> = Observable.create((observer: Observer<void>) => {
      console.log('emitting');
      this.socket.emit('setStreams', streamUrls, () => {
        console.log('ack');
        observer.next();
        observer.complete();
      });
    });
    return this.socketReady$.pipe(switchMap(() => obs));
  }
}
