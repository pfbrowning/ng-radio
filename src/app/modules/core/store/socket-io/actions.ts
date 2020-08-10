import { createAction, props } from '@ngrx/store';

export enum SocketIOActions {
    Initialized = '[Socket.IO Effects] Initialized',
    ManualConnectStart = '[Socket.IO Effects] Manual Connect Start',
    AuthenticateStart = '[Socket.IO Effects] Authenticate Start',
    Connected = '[Socket.IO Client] Connected',
    AutomaticReconnectStart = '[Socket.IO Client] Automatic Reconnect Start',
    AutomaticReconnectFailed ='[Socket.IO Client] Automatic Reconnect Failed',
    UserInitialized = '[Socket.IO Client] User Initialized',
    Unauthorized = '[Socket.IO Client] Unauthorized By Server',
    ServerDisconnect = '[Socket.IO Client] Server-Initiated Disconnect',
    NonServerDisconnect = '[Socket.IO Client] Non-Server Disconnect',
}

export const initialized = createAction(
    SocketIOActions.Initialized
);

export const manualConnectStart = createAction(
    SocketIOActions.ManualConnectStart
);

export const authenticateStart = createAction(
    SocketIOActions.AuthenticateStart
);

export const connected = createAction(
    SocketIOActions.Connected
);

export const automaticReconnectStart = createAction(
    SocketIOActions.AutomaticReconnectStart
);

export const automaticReconnectFailed = createAction(
    SocketIOActions.AutomaticReconnectFailed
);

export const userInitialized = createAction(
    SocketIOActions.UserInitialized
);

export const unauthorized = createAction(
    SocketIOActions.Unauthorized
);

export const serverDisconnect = createAction(
    SocketIOActions.ServerDisconnect
);

export const nonServerDisconnect = createAction(
    SocketIOActions.NonServerDisconnect
);