import { Action, createReducer, on } from '@ngrx/store';
import {
  selectStation,
  playAudioStart,
  playAudioSucceeded,
  playAudioFailed,
  audioPaused,
} from './player-actions';
import { initialPlayerState } from '../../models/player/initial-player-state';
import { PlayerStatus } from '../../models/player/player-status';
import { PlayerState } from '../../models/player/player-state';
import { PlayerActions } from './index';
import { StreamPreprocessingState } from '../../models/player/stream-preprocessing-state';

export const playerReducer = createReducer<PlayerState>(
  initialPlayerState,
  on(selectStation, (state, {station}) => ({
    ...state,
    currentStation: station,
    playerStatus: PlayerStatus.Stopped
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
  })),
  on(PlayerActions.preprocessStreamStart, (state, { streamUrl }) => ({
    ...state,
    checkedStreams: {
      ...state.checkedStreams,
      [streamUrl]: new StreamPreprocessingState(true, null, null)
    }
  })),
  on(PlayerActions.preprocessStreamSucceeded, (state, { streamUrl, validatedUrl }) => ({
    ...state,
    checkedStreams: {
      ...state.checkedStreams,
      [streamUrl]: new StreamPreprocessingState(false, validatedUrl, null),
      [validatedUrl]: new StreamPreprocessingState(false, validatedUrl, null)
    }
  })),
  on(PlayerActions.preprocessStreamFailed, (state, { streamUrl, reason }) => ({
    ...state,
    checkedStreams: {
      ...state.checkedStreams,
      [streamUrl]: new StreamPreprocessingState(false, null, reason)
    }
  })),
);