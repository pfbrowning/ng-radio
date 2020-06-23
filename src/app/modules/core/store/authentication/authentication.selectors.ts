import { createSelector } from '@ngrx/store';
import { RootState } from '../../models/root-state';

export const selectAuthenticationState = (state: RootState) => state.authentication;

export const isInitialized = createSelector(
    selectAuthenticationState,
    state => state.initialized
);

export const isAuthenticated = createSelector(
    selectAuthenticationState,
    state => state.authenticated
);

export const initializationState = createSelector(
    isInitialized,
    isAuthenticated,
    (initialized, authenticated) => ({initialized, authenticated})
);

export const currentUserEmail = createSelector(
    selectAuthenticationState,
    state => state.authenticated && state.email
);
