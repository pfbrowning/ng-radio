import { RootState } from '../../../models/root-state';
import { createSelector } from '@ngrx/store';

export const selectPlayerState = (state: RootState) => state.player;

export const selectCurrentStation = createSelector(
    selectPlayerState,
    (state) => state.currentStation
);