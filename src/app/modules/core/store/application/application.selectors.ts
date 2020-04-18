import { createSelector } from '@ngrx/store';
import { RootState } from '../../models/root-state';

export const selectApplicationState = (state: RootState) => state.application;

export const windowHasFocus = createSelector(
    selectApplicationState,
    state => state.windowHasFocus
);

export const toasterInitialized = createSelector(
    selectApplicationState,
    state => state.toasterInitialized
);
