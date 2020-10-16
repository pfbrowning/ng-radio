import { createReducer, on } from '@ngrx/store';
import { AuthenticationState } from './models/authentication-state';
import { initialAuthenticationState } from './models/initial-authentication-state';
import * as Actions from './authentication.actions';

export const reducer = createReducer<AuthenticationState>(
    initialAuthenticationState,
    on(
        Actions.initializeSucceeded,
        Actions.silentRefreshSucceeded,
        (state, { email, accessToken, authenticated }) => ({
            ...state,
            email,
            accessToken,
            authenticated,
        })
    ),
    on(Actions.initializeSucceeded, Actions.initializeFailed, (state) => ({
        ...state,
        initialized: true,
    })),
    on(Actions.accessTokenExpired, Actions.logoutButtonClicked, (state) => ({
        ...state,
        authenticated: false,
    }))
);
