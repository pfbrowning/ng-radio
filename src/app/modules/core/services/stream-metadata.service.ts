import { Injectable } from '@angular/core';
import { ConfigService } from './config/config.service';
import { Observable, Observer, ReplaySubject, Subject, fromEvent, combineLatest } from 'rxjs';
import { take, switchMap, tap, map } from 'rxjs/operators';
import { AuthenticationFacadeService } from '../store/authentication/authentication-facade.service';
import { SocketIOService } from './socket-io.service';
import io from 'socket.io-client';

@Injectable({ providedIn: 'root' })
export class StreamMetadataService {  
  public metadataReceived$ = this.socketIoService.metadataReceived$;

  constructor(private socketIoService: SocketIOService) { }

  public setConnectedStreams(streamUrls: Array<string>): Observable<void> {
    return this.socketIoService.sendAndWait('setStreams', streamUrls);
  }
}
