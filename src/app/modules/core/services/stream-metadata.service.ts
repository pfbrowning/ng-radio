import { Injectable } from '@angular/core';
import { ConfigService } from './config/config.service';
import { Observable, Observer, ReplaySubject, Subject, fromEvent } from 'rxjs';
import { take, switchMap, tap, map } from 'rxjs/operators';
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

  constructor(private configService: ConfigService) {
    this.configService.appConfig$.subscribe(config => {
      this.socket = io(config.radioProxyUrl);
      this.initializedSource.next();
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
