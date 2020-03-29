import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthenticationState } from '../models/authentication-state';

export const selectAuthenticationState = createFeatureSelector<AuthenticationState>('authentication');

export const selectIsAuthenticationInitialized = createSelector(
    selectAuthenticationState,
    state => state.initialized
);

export const selectIsAuthenticated = createSelector(
    selectAuthenticationState,
    state => state.authenticated
);
