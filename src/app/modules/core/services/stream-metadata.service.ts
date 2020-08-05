import { Injectable } from '@angular/core';
import { ConfigService } from './config/config.service';
import { Observable, Observer, ReplaySubject, Subject } from 'rxjs';
import { take, switchMap } from 'rxjs/operators';
import io from 'socket.io-client';

@Injectable({ providedIn: 'root' })
export class StreamMetadataService {
  private socket: SocketIOClient.Socket;
  private initializedSource = new ReplaySubject<void>();
  private socketReady$ = this.initializedSource.pipe(take(1));

  // TODO listen for the relevant event and next this subject
  private metadataReceivedSource = new Subject<{url: string, title: string}>();
  
  public metadataReceived$ = this.metadataReceivedSource.asObservable();

  constructor(private configService: ConfigService) {
    this.configService.appConfig$.subscribe(config => {
      this.socket = io(config.radioProxyUrl);
    });
  }

  public setConnectedStreams(streamUrls: Array<string>): Observable<void> {
    const obs: Observable<void> = Observable.create((observer: Observer<void>) => {
      const onCompleted = () => {
        observer.next();
        observer.complete();
      };
      this.socket.emit('setStreams', streamUrls, onCompleted);
    });
    return this.socketReady$.pipe(switchMap(() => obs));
  }
}
