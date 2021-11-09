import { createAction, props } from '@ngrx/store';
import { Station } from '../../models/player/station';

export enum PlayerActions {
  SelectStation = '[Radio Player] Select Station',
  PlayAudioStart = '[Radio Player] Play Audio Start',
  PlayAudioSucceeded = '[Radio Player] Play Audio Succeeded',
  PlayAudioFailed = '[Radio Player] Play Audio Failed',
  AudioPaused = '[Radio Player] Audio Paused',
}

export const selectStation = createAction(
  PlayerActions.SelectStation,
  props<{ station: Station }>()
);

export const playAudioStart = createAction(PlayerActions.PlayAudioStart);

export const playAudioSucceeded = createAction(PlayerActions.PlayAudioSucceeded);

export const playAudioFailed = createAction(
  PlayerActions.PlayAudioFailed,
  props<{ station: Station; error: any }>()
);

export const audioPaused = createAction(PlayerActions.AudioPaused);
