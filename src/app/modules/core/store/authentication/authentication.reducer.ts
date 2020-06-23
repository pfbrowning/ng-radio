import { Action, createReducer, on } from '@ngrx/store';
import {
  initializeSucceeded,
  initializeFailed,
  silentRefreshSucceeded,
  idTokenExpired,
  accessTokenExpired
} from './authentication.actions';
import { initialAuthenticationState } from '../../models/authentication/initial-authentication-state';
import { AuthenticationState } from '../../models/authentication/authentication-state';

const reducer = createReducer<AuthenticationState>(
  initialAuthenticationState,
  on(initializeSucceeded, (state, { idClaims, authenticated }) => ({
    ...state,
    authenticated,
    email: idClaims && idClaims['email'],
    initialized: true
  })),
  on(initializeFailed, state => ({
    ...state,
    initialized: true
  })),
  on(silentRefreshSucceeded, state => ({
    ...state,
    authenticated: true
  })),
  on(idTokenExpired, accessTokenExpired, state => ({
    ...state,
    authenticated: false
  })),
);

export function authenticationReducer(state: AuthenticationState | undefined, action: Action) {
  return reducer(state, action);
}
