export interface AuthenticationState {
    idToken: string;
    accessToken: string;
    idTokenExpiration: number;
    accessTokenExpiration: number;
    authenticated: boolean;
    email: string;
    initialized: boolean;
}
