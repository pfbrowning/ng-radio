import { createAction, props } from '@ngrx/store';

export enum AuthenticationActions {
    EffectsInit = '[Authentication] Effects Init',
    InitializeStart = '[Authentication] Initialize Start',
    InitializeSucceeded = '[Authentication] Initialize Succeeded',
    InitializeFailed = '[Authentication] Initialize Failed',
    SilentRefreshStart = '[Authentication] Silent Refresh Start',
    SilentRefreshSucceeded = '[Authentication] Silent Refresh Succeeded',
    SilentRefreshFailed = '[Authentication] Silent Refresh Failed',
    IdTokenExpired = '[Authentication] Id Token Expired',
    AccessTokenExpired = '[Authentication] Access Token Expired',
}

export const effectsInit = createAction(
    AuthenticationActions.EffectsInit
);

export const initializeStart = createAction(
    AuthenticationActions.InitializeStart
);

export const initializeSucceeded = createAction(
    AuthenticationActions.InitializeSucceeded,
    props<{
        idToken: string,
        idTokenExpiration: number,
        accessToken: string,
        accessTokenExpiration: number,
        authenticated: boolean,
        email: string
    }>()
);

export const initializeFailed = createAction(
    AuthenticationActions.InitializeSucceeded,
    props<{ error: any }>()
);

export const silentRefreshSucceeded = createAction(
    AuthenticationActions.SilentRefreshSucceeded,
    props<{ idToken: string, idTokenExpiration: number, accessToken: string, accessTokenExpiration: number }>()
);

export const silentRefreshFailed = createAction(
    AuthenticationActions.SilentRefreshFailed,
    props<{ error: any }>()
);

export const idTokenExpired = createAction(
    AuthenticationActions.IdTokenExpired
);

export const accessTokenExpired = createAction(
    AuthenticationActions.AccessTokenExpired
);
