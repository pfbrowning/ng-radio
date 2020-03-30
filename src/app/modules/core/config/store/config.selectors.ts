import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ConfigState } from '../models/config-state';

export const selectConfigState = createFeatureSelector<ConfigState>('config');

export const selectConfig = createSelector(
  selectConfigState,
  (state) => state.config
);