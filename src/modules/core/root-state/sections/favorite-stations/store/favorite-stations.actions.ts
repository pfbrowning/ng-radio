import { createAction, props } from '@ngrx/store';
import { FavoriteStation } from '@core-radio-logic';

export enum FavoriteStationsActions {
    FetchStationsStart = '[Favorite Stations] Fetch Stations Start',
    FetchStationsSucceeded = '[Favorite Stations] Fetch Stations Succeeded',
    FetchStationsFailed = '[Favorite Stations] Fetch Stations Failed',
}

export const fetchStationsStart = createAction(
    FavoriteStationsActions.FetchStationsStart
);

export const fetchStationsSucceeded = createAction(
    FavoriteStationsActions.FetchStationsSucceeded,
    props<{ stations: Array<FavoriteStation> }>()
);

export const fetchStationsFailed = createAction(
    FavoriteStationsActions.FetchStationsFailed,
    props<{ error: any }>()
);