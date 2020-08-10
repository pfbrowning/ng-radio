import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap, catchError, concatMap, debounceTime, distinctUntilChanged, skip, withLatestFrom, filter, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { isEqual } from 'lodash-es';
import { SocketIOService } from '../../services/socket-io.service';
import { SocketIoFacadeService } from './socket-io-facade.service';
import { ConfigService } from '../../services/config/config.service';
import { AuthenticationFacadeService } from '../authentication/authentication-facade.service';
import { StreamMetadataFacadeService } from '../stream-metadata/stream-metadata-facade.service';
import * as SocketIOActions from './actions';

/* TODO Split this into two different effects: one to map SignalR events to actions,
and the other to decide what to do when. */
@Injectable()
export class SocketIOEffects {
    constructor(
        private actions$: Actions,
        private configService: ConfigService,
        private authenticationFacade: AuthenticationFacadeService,
        private streamMetadataFacade: StreamMetadataFacadeService,
        private socketIOService: SocketIOService
    ) { }

    initialize$ = createEffect(() => this.configService.appConfig$.pipe(
        tap(({ radioProxyUrl }) => this.socketIOService.initialize(radioProxyUrl)),
        map(() => SocketIOActions.initialized())
    ));

    connected$ = createEffect(() => this.socketIOService.connect$.pipe(
        map(() => SocketIOActions.connected())
    ));

    reconnecting$ = createEffect(() => this.socketIOService.reconnecting$.pipe(
        map(() => SocketIOActions.automaticReconnectStart())
    ));

    reconnectFailed$ = createEffect(() => this.socketIOService.reconnectFailed$.pipe(
        map(() => SocketIOActions.automaticReconnectFailed())
    ));

    userInitialized$ = createEffect(() => this.socketIOService.userInitialized$.pipe(
        map(() => SocketIOActions.userInitialized())
    ));

    unauthorized$ = createEffect(() => this.socketIOService.unauthorized$.pipe(
        map(() => SocketIOActions.unauthorized())
    ));

    authenticateOnConnected$ = createEffect(() => this.actions$.pipe(
        ofType(SocketIOActions.connected),
        map(() => SocketIOActions.authenticateStart())
    ));

    authenticate$ = createEffect(() => this.actions$.pipe(
        ofType(SocketIOActions.authenticateStart),
        withLatestFrom(this.authenticationFacade.accessToken$),
        map(([, accessToken]) => this.socketIOService.authenticate(accessToken))
    ), { dispatch: false });

    serverDisconnect$ = createEffect(() => this.socketIOService.serverDisconnect$.pipe(
        map(() => SocketIOActions.serverDisconnect())
    ));

    nonServerDisconnect$ = createEffect(() => this.socketIOService.nonServerDisconnect$.pipe(
        map(() => SocketIOActions.nonServerDisconnect())
    ));

    reconnectOnServerDisconnect$ = createEffect(() => this.actions$.pipe(
        ofType(SocketIOActions.serverDisconnect),
        // Don't reconnect if we weren't subscribed to any urls for metadata
        withLatestFrom(this.streamMetadataFacade.urlsSelectedForMetadata$),
        filter(([, urls]) => urls.length > 0),
        map(() => SocketIOActions.manualConnectStart())
    ));

    manualReconnect$ = createEffect(() => this.actions$.pipe(
        ofType(SocketIOActions.manualConnectStart),
        map(() => this.socketIOService.reconnect())
    ), { dispatch: false });
}
