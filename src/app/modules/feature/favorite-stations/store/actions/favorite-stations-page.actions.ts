import { createAction, props } from '@ngrx/store'

export enum FavoriteStationsPageActionType {
    DeleteFavoriteConfirmed = '[Favorite Stations Page] Delete Station Confirmed',
}

export const deleteFavoriteConfirmed = createAction(
    FavoriteStationsPageActionType.DeleteFavoriteConfirmed,
    props<{ stationId: number }>()
)
