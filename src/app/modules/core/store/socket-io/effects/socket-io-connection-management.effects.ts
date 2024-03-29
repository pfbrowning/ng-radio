import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, map, tap, withLatestFrom, filter } from 'rxjs/operators';
import { SocketIOService } from '../../../services/socket-io.service';
import { SocketIOActions } from '../actions';
import { ConfigProviderService } from '../../../services/config/config-provider.service';
import { AccessTokenProviderService } from '../../../services/authentication/access-token-provider.service';
import { PlayerFacadeService } from '../../player/player-facade.service';
import { PlayerStatus } from '../../../models/player/player-status';

@Injectable()
export class SocketIOConnectionManagementEffects {
  constructor(
    private actions$: Actions,
    private socketIOService: SocketIOService,
    private configProvider: ConfigProviderService,
    private accessTokenProvider: AccessTokenProviderService,
    private playerFacade: PlayerFacadeService
  ) {}

  initializeOnConfigLoaded$ = createEffect(() =>
    this.configProvider
      .getConfigOnceLoaded()
      .pipe(map(config => SocketIOActions.initializeStart({ url: config.radioProxyUrl })))
  );

  initialize$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SocketIOActions.initializeStart),
        tap(({ url }) => this.socketIOService.initialize(url))
      ),
    { dispatch: false }
  );

  authenticateOnConnect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SocketIOActions.connected),
        switchMap(() => this.accessTokenProvider.getAccessTokenOnceAuthenticated()),
        tap(accessToken => this.socketIOService.authenticate(accessToken))
        /* TODO should we instead map this to an authenticateStart action so that we can track the
        authentication handshake state? */
      ),
    { dispatch: false }
  );

  // Reconnect to Socket.IO if the server closed the connection while we're subscribed to (a) stream(s)
  reconnect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SocketIOActions.disconnected),
        withLatestFrom(this.playerFacade.playerStatus$),
        filter(
          ([{ message }, playerStatus]) =>
            message === 'io server disconnect' && playerStatus === PlayerStatus.Playing
        ),
        // TODO should we map connect behind a connectStart action as a stretch goal?
        tap(() => this.socketIOService.connect())
      ),
    { dispatch: false }
  );
}
