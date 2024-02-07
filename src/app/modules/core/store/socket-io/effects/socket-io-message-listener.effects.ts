import { Injectable } from '@angular/core';
import { Actions, OnInitEffects, createEffect, ofType } from '@ngrx/effects';
import { ConfigActions } from './actions';
import { switchMap, catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { ConfigService } from '@core/services';
import { Action } from '@ngrx/store';
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
