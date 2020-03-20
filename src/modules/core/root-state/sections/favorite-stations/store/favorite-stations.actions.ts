import { createAction, props } from '@ngrx/store';
import { Station } from '@core-radio-logic';

export enum FavoriteStationsActions {
    FetchStationsStart = '[Favorite Stations] Fetch Stations Start',
    FetchStationsSucceeded = '[Favorite Stations] Fetch Stations Succeeded',
    FetchStationsFailed = '[Favorite Stations] Fetch Stations Failed',
    AddCurrentStationToFavoritesRequested = '[Favorite Stations] Add Current Station To Favorites Requested',
    AddToFavoritesStart = '[Favorite Stations] Add To Favorites Start',
    AddToFavoritesSucceeded = '[Favorite Stations] Add To Favorites Succeeded',
    AddToFavoritesFailed = '[Favorite Stations] Add To Favorites Failed',
    RemoveCurrentStationFromFavoritesRequested = '[Favorite Stations] Remove Current Station From Favorites Requested',
    RemoveFromFavoritesStart = '[Favorite Stations] Remove From Favorites Start',
    RemoveFromFavoritesSucceeded = '[Favorite Stations] Remove From Favorites Succeeded',
    RemoveFromFavoritesFailed = '[Favorite Stations] Remove From Favorites Failed',
}

export const fetchStationsStart = createAction(
    FavoriteStationsActions.FetchStationsStart
);

export const fetchStationsSucceeded = createAction(
    FavoriteStationsActions.FetchStationsSucceeded,
    props<{ stations: Array<Station> }>()
);

export const fetchStationsFailed = createAction(
    FavoriteStationsActions.FetchStationsFailed,
    props<{ error: any }>()
);

export const addCurrentStationToFavoritesRequested = createAction(
    FavoriteStationsActions.AddCurrentStationToFavoritesRequested,
);

export const addToFavoritesStart = createAction(
    FavoriteStationsActions.AddToFavoritesStart,
    props<{ station: Station }>()
);

export const addToFavoritesSucceeded = createAction(
    FavoriteStationsActions.AddToFavoritesSucceeded,
    props<{ station: Station }>()
);

export const addToFavoritesFailed = createAction(
    FavoriteStationsActions.AddToFavoritesFailed,
    props<{ station: Station, error: any }>()
);

export const removeCurrentStationFromFavoritesRequested = createAction(
    FavoriteStationsActions.RemoveCurrentStationFromFavoritesRequested,
);

export const removeFromFavoritesStart = createAction(
    FavoriteStationsActions.RemoveFromFavoritesStart,
    props<{ stationId: number }>()
);

export const removeFromFavoritesSucceeded = createAction(
    FavoriteStationsActions.RemoveFromFavoritesSucceeded,
    props<{ stationId: number }>()
);

export const removeFromFavoritesFailed = createAction(
    FavoriteStationsActions.RemoveFromFavoritesFailed,
    props<{ stationId: number, error: any }>()
);