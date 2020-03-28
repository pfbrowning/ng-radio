import { Action, createReducer, on } from '@ngrx/store';
import { initialPlayerState } from '../models/initial-player-state';
import { PlayerState } from '../models/player-state';
import { PlayerStatus } from '../models/player-status';
import { StreamInfoStatus } from '@core';
import {
  selectStation,
  playAudioStart,
  playAudioSucceeded,
  playAudioFailed,
  audioPaused,
  fetchStreamInfoStart,
  fetchStreamInfoSucceeded,
  fetchStreamInfoFailed
} from './player-actions';

const reducer = createReducer(
  initialPlayerState,
  on(selectStation, (state, {station}) => ({
    ...state,
    streamInfo: null,
    streamInfoStatus: StreamInfoStatus.NotInitialized,
    currentStation: station,
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
);

export function playerReducer(state: PlayerState | undefined, action: Action) {
  return reducer(state, action);
}
