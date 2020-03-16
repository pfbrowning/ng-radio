import { Action, createReducer, on } from '@ngrx/store';
import { initialPlayerState } from '../models/initial-player-state';
import { selectStation } from './player-actions';
import { PlayerState } from '../models/player-state';

const reducer = createReducer(
  initialPlayerState,
  on(selectStation, (state, {station}) => ({
    ...state,
    currentStation: station,
  })),
);

export function playerReducer(state: PlayerState | undefined, action: Action) {
  return reducer(state, action);
}
