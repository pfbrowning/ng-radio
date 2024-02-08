import { createAction, props } from '@ngrx/store';
import { MetadataRecievedDto } from '../../../models/socket-io/metadata-recieved-dto';

enum SocketIOActions {
  InitializeStart = '[SocketIO] Initialize Start',
  Disconnected = '[SocketIO] Disconnected',
  Connected = '[SocketIO] Connected',
  Unauthorized = '[SocketIO] Unauthorized',
  SocketInitializedServerSide = '[SocketIO] Socket Initialized Server-Side',
  MetadataReceived = '[SocketIO] Metadata Received',
}

export const initializeStart = createAction(
  SocketIOActions.InitializeStart,
  props<{ url: string }>()
);

export const disconnected = createAction(
  SocketIOActions.Disconnected,
  props<{ message: string }>()
);

export const connected = createAction(SocketIOActions.Connected);

export const unauthorized = createAction(SocketIOActions.Unauthorized);

export const socketInitializedServerSide = createAction(
  SocketIOActions.SocketInitializedServerSide
);

export const metadataReceived = createAction(
  SocketIOActions.MetadataReceived,
  props<{ message: MetadataRecievedDto }>()
);
