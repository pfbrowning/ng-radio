import { createAction } from '@ngrx/store';

export enum PlayerBarActions {
  AddToFavoritesClicked = '[Player Bar] Add To Favorites Clicked',
  RemoveFromFavoritesClicked = '[Player Bar] Remove From Favorites Clicked',
  PlayClicked = '[Player Bar] Play Button Clicked',
  PauseClicked = '[Player Bar] Pause Button Clicked',
}

export const addToFavoritesClicked = createAction(PlayerBarActions.AddToFavoritesClicked);

export const removeFromFavoritesClicked = createAction(PlayerBarActions.RemoveFromFavoritesClicked);

export const playClicked = createAction(PlayerBarActions.PlayClicked);

export const pauseClicked = createAction(PlayerBarActions.PauseClicked);
