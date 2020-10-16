import { createReducer, on } from '@ngrx/store';
import { AuthenticationState } from './models/authentication-state';
import { initialAuthenticationState } from './models/initial-authentication-state';
import { AuthenticationActions } from './actions';

export const authenticationReducer = createReducer<AuthenticationState>(
    initialAuthenticationState,
    on(
        AuthenticationActions.initializeSucceeded,
        AuthenticationActions.silentRefreshSucceeded,
        (state, { email, accessToken, authenticated }) => ({
            ...state,
            email,
            accessToken,
            authenticated,
        })
    ),
    on(
        AuthenticationActions.initializeSucceeded,
        AuthenticationActions.initializeFailed,
        state => ({
            ...state,
            initialized: true,
        })
    ),
    on(
        AuthenticationActions.accessTokenExpired,
        AuthenticationActions.logoutButtonClicked,
        state => ({
            ...state,
            authenticated: false,
        })
    )
);
