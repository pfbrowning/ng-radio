export interface AuthenticationState {
    idToken: string;
    accessToken: string;
    idTokenExpiration: number;
    accessTokenExpiration: number;
    authenticated: boolean;
    initialized: boolean;
};