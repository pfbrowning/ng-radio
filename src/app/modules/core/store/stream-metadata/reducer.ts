import { Action, createReducer, on } from '@ngrx/store';
import { initialPlayerState } from '../../models/player/initial-player-state';
import { PlayerStatus } from '../../models/player/player-status';
import { PlayerState } from '../../models/player/player-state';
import { StreamPreprocessingState } from '../../models/player/stream-preprocessing-state';
import { initialStreamMetadataState } from './models/initial-stream-metadata-state';
import { StreamMetadataState } from './models/stream-metadata-state';
import * as Actions from './actions';

export const streamMetadataReducer = createReducer<StreamMetadataState>(
  initialStreamMetadataState,
  on(Actions.setStreamListStart, (state, {streams}) => ({
    ...state,
    streams: streams.reduce((prev, current: string) => ({
        ...prev,
        [current]: state.streams[current] || null
    }), {}),
    connectionInProgressStreams: state.connectionInProgressStreams.concat(streams),
  })),
  on(Actions.setStreamListSucceeded, Actions.setStreamListFailed, (state, {streams}) => ({
    ...state,
    connectionInProgressStreams: state.connectionInProgressStreams.filter(s => !streams.includes(s)),
  })),
  on(Actions.metadataReceived, (state, {url, title}) => ({
    ...state,
    streams: {
        ...state.streams,
        [url]: title
    }
  })),
);