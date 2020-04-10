import { Action, createReducer, on } from '@ngrx/store';
import {
  selectStation,
  playAudioStart,
  playAudioSucceeded,
  playAudioFailed,
  audioPaused,
  fetchStreamInfoStart,
  fetchStreamInfoSucceeded,
  fetchStreamInfoFailed,
  validateStreamStart,
  validateStreamSucceeded,
  validateStreamFailed,
  validateStreamSubmit
} from './player-actions';
import { initialPlayerState } from '../../models/player/initial-player-state';
import { StreamInfoStatus } from '../../models/player/stream-info-status';
import { PlayerStatus } from '../../models/player/player-status';
import { PlayerState } from '../../models/player/player-state';
import { StreamValidityState } from '../../models/player/stream-validity-state';

const reducer = createReducer(
  initialPlayerState,
  on(selectStation, (state, {station}) => ({
    ...state,
    streamInfo: null,
    streamInfoStatus: StreamInfoStatus.NotInitialized,
    currentStation: station
  })),
  on(playAudioStart, state => ({
    ...state,
    playerStatus: PlayerStatus.LoadingAudio
  })),
  on(playAudioSucceeded, state => ({
    ...state,
    playerStatus: PlayerStatus.Playing
  })),
  on(playAudioFailed, state => ({
    ...state,
    playerStatus: PlayerStatus.Stopped
  })),
  on(audioPaused, state => ({
    ...state,
    playerStatus: PlayerStatus.Stopped,
    streamInfo: null,
    streamInfoStatus: StreamInfoStatus.NotInitialized
  })),
  on(fetchStreamInfoStart, (state, {streamUrl}) => ({
    ...state,
    streamInfoStatus: StreamInfoStatus.LoadingStreamInfo
  })),
  on(fetchStreamInfoSucceeded, (state, {streamInfo}) => ({
    ...state,
    streamInfo,
    streamInfoStatus: StreamInfoStatus.Valid
  })),
  on(fetchStreamInfoFailed, state => ({
    ...state,
    streamInfo: null,
    streamInfoStatus: StreamInfoStatus.Error
  })),
  on(validateStreamSubmit, (state, { streamUrl }) => ({
    ...state,
    validatedStreams: new Map([
      ...state.validatedStreams, [
        streamUrl,
        new StreamValidityState(
          state.validatedStreams.has(streamUrl)
            ? state.validatedStreams.get(streamUrl).inProgress
            : false,
          state.validatedStreams.has(streamUrl)
            ? state.validatedStreams.get(streamUrl).validatedUrl
            : null,
          null
        )
      ]
    ])
  })),
  on(validateStreamStart, (state, { streamUrl }) => ({
    ...state,
    validatedStreams: new Map([
      ...state.validatedStreams,
      [ streamUrl, new StreamValidityState(true, null, null) ]
    ])
  })),
  on(validateStreamSucceeded, (state, { streamUrl, validatedUrl }) => ({
    ...state,
    validatedStreams: new Map([
      ...state.validatedStreams,
      [ streamUrl, new StreamValidityState(false, validatedUrl, null) ],
      [ validatedUrl, new StreamValidityState(false, validatedUrl, null) ]
    ])
  })),
  on(validateStreamFailed, (state, { streamUrl, reason }) => ({
    ...state,
    validatedStreams: new Map([
      ...state.validatedStreams,
      [ streamUrl, new StreamValidityState(false, null, reason)]
    ])
  })),
);

export function playerReducer(state: PlayerState | undefined, action: Action) {
  return reducer(state, action);
}
