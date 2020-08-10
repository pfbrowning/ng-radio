import { Action, createReducer, on } from '@ngrx/store';
import { initialPlayerState } from '../../models/player/initial-player-state';
import { PlayerStatus } from '../../models/player/player-status';
import { PlayerState } from '../../models/player/player-state';
import { StreamPreprocessingState } from '../../models/player/stream-preprocessing-state';
import * as Actions from './actions';
import { SocketIOState } from './models/socket-io-state';
import { initialSocketIOState } from './models/initial-socket-io-state';

export const socketIOReducer = createReducer<SocketIOState>(
  initialSocketIOState,
  on(Actions.initialized, state => ({
    ...state,
    initialized: true,
    manualConnectInProgress: true
  })),
  on(Actions.manualConnectStart, state => ({
    ...state,
    manualConnectInProgress: true
  })),
  on(Actions.authenticateStart, state => ({
    ...state,
    authenticationInProgress: true
  })),
  on(Actions.connected, state => ({
    ...state,
    connected: true,
    manualConnectInProgress: false
  })),
  on(Actions.automaticReconnectStart, state => ({
    ...state,
    automaticReconnectInProgress: true,
    manualConnectInProgress: false
  })),
  on(Actions.automaticReconnectFailed, state => ({
    ...state,
    automaticReconnectInProgress: false
  })),
  on(Actions.userInitialized, state => ({
    ...state,
    authenticated: true
  })),
  on(Actions.unauthorized, state => ({
    ...state,
    authenticated: false
  })),
  on(Actions.serverDisconnect, Actions.nonServerDisconnect, state => ({
    ...state,
    connected: false,
    authenticated: false
  })),
);