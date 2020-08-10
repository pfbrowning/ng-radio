export interface SocketIOState {
    initialized: boolean;
    connected: boolean;
    manualConnectInProgress: boolean;
    automaticReconnectInProgress: boolean;
    authenticated: boolean;
    authenticationInProgress: boolean;
}
