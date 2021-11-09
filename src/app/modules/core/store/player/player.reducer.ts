import { createReducer, on } from '@ngrx/store';
import {
  selectStation,
  playAudioStart,
  playAudioSucceeded,
  playAudioFailed,
  audioPaused,
} from './player-actions';
import { initialPlayerState } from './models/initial-player-state';
import { PlayerStatus } from '../../models/player/player-status';
import { PlayerState } from './models/player-state';

export const playerReducer = createReducer<PlayerState>(
  initialPlayerState,
  on(selectStation, (state, { station }) => ({
    ...state,
    currentStation: station,
    playerStatus: PlayerStatus.Stopped,
  })),
  on(playAudioStart, state => ({
    ...state,
    playerStatus: PlayerStatus.LoadingAudio,
  })),
  on(playAudioSucceeded, state => ({
    ...state,
    playerStatus: PlayerStatus.Playing,
  })),
  on(playAudioFailed, state => ({
    ...state,
    playerStatus: PlayerStatus.Stopped,
  })),
  on(audioPaused, state => ({
    ...state,
    playerStatus: PlayerStatus.Stopped,
  }))
);
