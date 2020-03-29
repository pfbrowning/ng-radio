import { AuthenticationState } from './authentication-state';

export const initialAuthenticationState: AuthenticationState = {
    idToken: null,
    accessToken: null,
    idTokenExpiration: null,
    accessTokenExpiration: null,
    authenticated: false,
    initialized: false
}