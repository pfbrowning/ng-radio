import { createReducer, on } from '@ngrx/store';
import { initialStreamMetadataState } from './models/initial-stream-metadata-state';
import { StreamMetadataState } from './models/stream-metadata-state';
import * as StreamMetadataActions from './actions';
import { SocketIOActions } from '../socket-io/actions';

export const streamMetadataReducer = createReducer<StreamMetadataState>(
  initialStreamMetadataState,
  on(StreamMetadataActions.setStreamList, (state, { streams }) => ({
    ...state,
    streams: streams.reduce(
      (prev, current: string) => ({
        ...prev,
        [current]: state.streams[current] || null,
      }),
      {}
    ),
  })),
  on(SocketIOActions.metadataReceived, (state, { message }) => ({
    ...state,
    streams: {
      ...state.streams,
      [message.url]: message.title,
    },
  }))
);
