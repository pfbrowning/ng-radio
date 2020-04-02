import { createSelector } from '@ngrx/store';
import { RootState } from '../../models/root-state';

export const selectAuthenticationState = (state: RootState) => state.authentication;

export const selectIsAuthenticationInitialized = createSelector(
    selectAuthenticationState,
    state => state.initialized
);

export const selectIsAuthenticated = createSelector(
    selectAuthenticationState,
    state => state.authenticated
);

export const selectAccessToken = createSelector(
    selectAuthenticationState,
    state => state.accessToken
);

export const selectInitializedAndAccessToken = createSelector(
    selectIsAuthenticationInitialized,
    selectAccessToken,
    (initialized, accessToken) => ({initialized, accessToken})
);

export const selectEmail = createSelector(
    selectAuthenticationState,
    state => state.email
);
