import { RootState } from '../../../models/root-state';
import { createSelector } from '@ngrx/store';

export const selectAuthenticationState = (state: RootState) => state.authentication;

export const selectIsAuthenticationInitialized = createSelector(
    selectAuthenticationState,
    state => state.initialized
);

export const selectIsAuthenticated = createSelector(
    selectAuthenticationState,
    state => state.authenticated
);