import { SocketIOState } from './socket-io-state';

export const initialSocketIOState: SocketIOState = {
    initialized: false,
    connected: false,
    manualConnectInProgress: false,
    automaticReconnectInProgress: false,
    authenticated: false,
    authenticationInProgress: false
};
