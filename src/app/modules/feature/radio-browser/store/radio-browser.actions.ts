import { createAction, props } from '@ngrx/store';
import { Station } from '@core/models/player';

export enum RadioBrowserActions {
  NameTermUpdated = '[Radio Browser] Name Term Updated',
  TagTermUpdated = '[Radio Browser] Tag Term Updated',
  SearchStart = '[Radio Browser] Search Start',
  SearchSucceeded = '[Radio Browser] Search Succeeded',
  SearchFailed = '[Radio Browser] Search Failed',
}

export const nameTermUpdated = createAction(
  RadioBrowserActions.NameTermUpdated,
  props<{ term: string }>()
);

export const tagTermUpdated = createAction(
  RadioBrowserActions.TagTermUpdated,
  props<{ term: string }>()
);

export const searchStart = createAction(
  RadioBrowserActions.SearchStart
);

export const searchSucceeded = createAction(
  RadioBrowserActions.SearchSucceeded,
  props<{ results: Array<Station> }>()
);

export const searchFailed = createAction(
  RadioBrowserActions.SearchFailed,
  props<{ error: any }>()
);
