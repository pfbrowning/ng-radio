import { createSelector } from '@ngrx/store';
import { RootState } from '../../models/root-state';

export const selectConfigState = (state: RootState) => state.config;

export const selectConfig = createSelector(
  selectConfigState,
  (state) => state.config
);
