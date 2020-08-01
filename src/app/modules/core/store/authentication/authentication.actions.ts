import { createAction, props } from '@ngrx/store';

export enum AuthenticationActions {
    EffectsInit = '[Authentication] Effects Init',
    InitializeStart = '[Authentication] Initialize Start',
    InitializeSucceeded = '[Authentication] Initialize Succeeded',
    InitializeFailed = '[Authentication] Initialize Failed',
    SilentRefreshStart = '[Authentication] Silent Refresh Start',
    SilentRefreshSucceeded = '[Authentication] Silent Refresh Succeeded',
    SilentRefreshFailed = '[Authentication] Silent Refresh Failed',
    AccessTokenExpired = '[Authentication] Access Token Expired',
    LogoutButtonClicked = '[Authentication] Logout Button Clicked',
}

export const effectsInit = createAction(
    AuthenticationActions.EffectsInit
);

export const initializeStart = createAction(
    AuthenticationActions.InitializeStart
);

export const initializeSucceeded = createAction(
    AuthenticationActions.InitializeSucceeded,
    props<{ email: string, accessToken: string, authenticated: boolean }>()
);

export const initializeFailed = createAction(
    AuthenticationActions.InitializeFailed,
    props<{ error: any }>()
);

export const silentRefreshSucceeded = createAction(
    AuthenticationActions.SilentRefreshSucceeded,
    props<{  email: string, accessToken: string, authenticated: boolean }>()
);

export const accessTokenExpired = createAction(
    AuthenticationActions.AccessTokenExpired
);

export const logoutButtonClicked = createAction(
    AuthenticationActions.LogoutButtonClicked
);
