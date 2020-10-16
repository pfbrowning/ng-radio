import { createSelector } from '@ngrx/store';
import { RootState } from '../../../models/root-state';

const authenticationStateRoot = (state: RootState) => state.authentication;

export const authenticationState = createSelector(
    authenticationStateRoot,
    state => state
);

export const isInitialized = createSelector(
    authenticationState,
    state => state.initialized
);
