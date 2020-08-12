import { createReducer, on } from '@ngrx/store';
import { initialStreamMetadataState } from './models/initial-stream-metadata-state';
import { StreamMetadataState } from './models/stream-metadata-state';
import * as Actions from './actions';

export const streamMetadataReducer = createReducer<StreamMetadataState>(
  initialStreamMetadataState,
  on(Actions.setStreamList, (state, {streams}) => ({
    ...state,
    streams: streams.reduce((prev, current: string) => ({
        ...prev,
        [current]: state.streams[current] || null
    }), {}),
  })),
  on(Actions.metadataReceived, (state, {url, title}) => ({
    ...state,
    streams: {
        ...state.streams,
        [url]: title
    }
  })),
);
