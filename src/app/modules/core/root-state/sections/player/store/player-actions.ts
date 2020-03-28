import { createAction, props } from '@ngrx/store';
import { Station } from '@core';

export enum PlayerActions {
    SelectStation = '[Radio Player] Select Station'
}

export const selectStation = createAction(
    PlayerActions.SelectStation,
    props<{ station: Station}>()
);
