import { Injectable } from '@angular/core';
import { createEffect } from '@ngrx/effects';
import { map } from 'rxjs/operators';
import { SocketIOService } from '../../../services/socket-io.service';
import { SocketIOActions } from '../actions';

@Injectable()
export class SocketIOMessageListenerEffects {
  constructor(private socketIOService: SocketIOService) {}

  disconnected$ = createEffect(() =>
    this.socketIOService.disconnected$.pipe(
      map(message => SocketIOActions.disconnected({ message }))
    )
  );

  connected$ = createEffect(() =>
    this.socketIOService.connected$.pipe(map(SocketIOActions.connected))
  );

  unauthorized$ = createEffect(() =>
    this.socketIOService.unauthorized$.pipe(map(SocketIOActions.unauthorized))
  );

  socketInitializedServerside$ = createEffect(() =>
    this.socketIOService.socketInitializedServerside$.pipe(
      map(SocketIOActions.socketInitializedServerSide)
    )
  );

  metadataReceived$ = createEffect(() =>
    this.socketIOService.metadataReceived$.pipe(
      map(message => SocketIOActions.metadataReceived({ message }))
    )
  );
}
