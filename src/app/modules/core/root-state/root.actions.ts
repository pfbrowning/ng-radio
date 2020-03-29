import { createAction } from '@ngrx/store';

export enum AppRootActions {
    AppInit = '[App Root] App Init',
}

export const appInit = createAction(
    AppRootActions.AppInit
);
