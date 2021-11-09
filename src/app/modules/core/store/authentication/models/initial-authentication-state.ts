import { AuthenticationState } from './authentication-state';

export const initialAuthenticationState: AuthenticationState = {
  initialized: false,
  authenticated: false,
  email: null,
  accessToken: null,
};
