import { createAction } from '@ngrx/store';

export enum Actions {
    Init = '[Favorite Stations Route Resolver] Route Resolve Init',
}

export const init = createAction(
    Actions.Init
);
