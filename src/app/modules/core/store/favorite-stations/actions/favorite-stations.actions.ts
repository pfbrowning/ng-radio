import { createAction, props } from '@ngrx/store'
import { Station } from '../../../models/player/station'

export enum FavoriteStationsActions {
    FetchStationsSubmit = '[Favorite Stations] Fetch Stations Submit',
    FetchStationsStart = '[Favorite Stations] Fetch Stations Start',
    FetchStationsSucceeded = '[Favorite Stations] Fetch Stations Succeeded',
    FetchStationsFailed = '[Favorite Stations] Fetch Stations Failed',
    AddToFavoritesStart = '[Favorite Stations] Add To Favorites Start',
    AddToFavoritesSucceeded = '[Favorite Stations] Add To Favorites Succeeded',
    AddToFavoritesFailed = '[Favorite Stations] Add To Favorites Failed',
    RemoveFromFavoritesStart = '[Favorite Stations] Remove From Favorites Start',
    RemoveFromFavoritesSucceeded = '[Favorite Stations] Remove From Favorites Succeeded',
    RemoveFromFavoritesFailed = '[Favorite Stations] Remove From Favorites Failed',
    OpenStationEditNew = '[Station Edit] Open Station Edit New',
    OpenStationEditCurrent = '[Station Edit] Open Station Edit Current',
    OpenStationEditExisting = '[Station Edit] Open Station Edit Existing',
    CloseStationEdit = '[Station Edit] Close Station Edit',
    StationUpdateStart = '[Station Edit] Station Update Start',
    StationUpdateSucceeded = '[Station Edit] Station Update Succeeded',
    StationUpdateFailed = '[Station Edit] Station Update Failed',
}

export const fetchStationsSubmit = createAction(
    FavoriteStationsActions.FetchStationsSubmit
)

export const fetchStationsStart = createAction(
    FavoriteStationsActions.FetchStationsStart
)

export const fetchStationsSucceeded = createAction(
    FavoriteStationsActions.FetchStationsSucceeded,
    props<{ stations: Station[] }>()
)

export const fetchStationsFailed = createAction(
    FavoriteStationsActions.FetchStationsFailed,
    props<{ error: any }>()
)

export const addToFavoritesStart = createAction(
    FavoriteStationsActions.AddToFavoritesStart,
    props<{ station: Station }>()
)

export const addToFavoritesSucceeded = createAction(
    FavoriteStationsActions.AddToFavoritesSucceeded,
    props<{ station: Station }>()
)

export const addToFavoritesFailed = createAction(
    FavoriteStationsActions.AddToFavoritesFailed,
    props<{ station: Station; error: any }>()
)

export const removeFromFavoritesStart = createAction(
    FavoriteStationsActions.RemoveFromFavoritesStart,
    props<{ stationId: number }>()
)

export const removeFromFavoritesSucceeded = createAction(
    FavoriteStationsActions.RemoveFromFavoritesSucceeded,
    props<{ stationId: number }>()
)

export const removeFromFavoritesFailed = createAction(
    FavoriteStationsActions.RemoveFromFavoritesFailed,
    props<{ stationId: number; error: any }>()
)

export const openStationEditNew = createAction(
    FavoriteStationsActions.OpenStationEditNew
)

export const openStationEditCurrent = createAction(
    FavoriteStationsActions.OpenStationEditCurrent
)

export const openStationEditExisting = createAction(
    FavoriteStationsActions.OpenStationEditExisting,
    props<{ stationId: number }>()
)

export const closeStationEdit = createAction(
    FavoriteStationsActions.CloseStationEdit
)

export const stationUpdateStart = createAction(
    FavoriteStationsActions.StationUpdateStart,
    props<{ station: Station }>()
)

export const stationUpdateSucceeded = createAction(
    FavoriteStationsActions.StationUpdateSucceeded,
    props<{ updated: Station }>()
)

export const stationUpdateFailed = createAction(
    FavoriteStationsActions.StationUpdateFailed,
    props<{ station: Station; error: any }>()
)
