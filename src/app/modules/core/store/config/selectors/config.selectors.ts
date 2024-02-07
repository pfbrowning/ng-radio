import { createSelector } from '@ngrx/store';
import { RootState } from '../../../models/root-state';

export const configState = (state: RootState) => state.config;

export const appConfig = createSelector(configState, state => state.appConfig);
