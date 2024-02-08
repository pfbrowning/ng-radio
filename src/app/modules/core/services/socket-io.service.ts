import { Injectable } from '@angular/core';
import { Observable, fromEvent, ReplaySubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import io from 'socket.io-client';
import { MetadataRecievedDto } from '../models/socket-io/metadata-recieved-dto';

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

  public disconnected$ = this.createStreamFromSocketEvent<string>('disconnect');
  public connected$ = this.createStreamFromSocketEvent<void>('connect');
  public unauthorized$ = this.createStreamFromSocketEvent<void>('unauthorized');
  public socketInitializedServerside$ = this.createStreamFromSocketEvent<void>(
    'socketInitializedServerside'
  );
  public metadataReceived$ = this.createStreamFromSocketEvent<MetadataRecievedDto>('metadata');

  public initialize(url: string): void {
    // TODO use this for authentication https://github.com/Thream/socketio-jwt
    this.socket = io(url);
    this.socketReferenceInitialized$.next();
  }
}
