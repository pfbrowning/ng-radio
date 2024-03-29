import { PlayerStatus } from '@core/models/player';
import { createSelector } from '@ngrx/store';
import { RootState } from '../../../models/root-state';

export const selectPlayerState = (state: RootState) => state.player;

export const currentStation = createSelector(selectPlayerState, state => state.currentStation);

export const playerStatus = createSelector(selectPlayerState, state => state.playerStatus);

export const isAudioPlaying = createSelector(
  playerStatus,
  status => status === PlayerStatus.Playing
);
