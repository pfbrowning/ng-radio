import { createAction, props } from '@ngrx/store';
import { Station } from '@core/models/player';
import { Country } from '@core/models';

export enum RadioBrowserActions {
  ResolveSubmit = '[Radio Browser] Resolve Submit',
  NameTermUpdated = '[Radio Browser] Name Term Updated',
  TagTermUpdated = '[Radio Browser] Tag Term Updated',
  CountrySelected = '[Radio Browser] Country Selected',
  SearchStart = '[Radio Browser] Search Start',
  SearchSucceeded = '[Radio Browser] Search Succeeded',
  SearchFailed = '[Radio Browser] Search Failed',
  CountriesFetchStart = '[Radio Browser] Countries Fetch Start',
  CountriesFetchSucceeded = '[Radio Browser] Countries Fetch Succeeded',
  CountriesFetchFailed = '[Radio Browser] Countries Fetch Failed',
  TagInputFocused = '[Radio Browser] Tag Input Focused',
  TagSuggestionsFetchStart = '[Radio Browser] Tag Suggestions Fetch Start',
  TagSuggestionsFetchSucceeded = '[Radio Browser] Tag Suggestions Fetch Succeeded',
  TagSuggestionsFetchFailed = '[Radio Browser] Tag Suggestions Fetch Failed',
}

export const resolveSubmit = createAction(
  RadioBrowserActions.ResolveSubmit
);

export const nameTermUpdated = createAction(
  RadioBrowserActions.NameTermUpdated,
  props<{ term: string }>()
);

export const tagTermUpdated = createAction(
  RadioBrowserActions.TagTermUpdated,
  props<{ term: string }>()
);

export const countrySelected = createAction(
  RadioBrowserActions.CountrySelected,
  props<{ country: string }>()
);

export const searchStart = createAction(
  RadioBrowserActions.SearchStart
);

export const searchSucceeded = createAction(
  RadioBrowserActions.SearchSucceeded,
  props<{ results: Station[] }>()
);

export const searchFailed = createAction(
  RadioBrowserActions.SearchFailed,
  props<{ error: any }>()
);

export const countriesFetchStart = createAction(
  RadioBrowserActions.CountriesFetchStart
);

export const countriesFetchSucceeded = createAction(
  RadioBrowserActions.CountriesFetchSucceeded,
  props<{ countries: Country[] }>()
);

export const countriesFetchFailed = createAction(
  RadioBrowserActions.CountriesFetchFailed,
  props<{ error: any }>()
);

export const tagInputFocused = createAction(
  RadioBrowserActions.TagInputFocused
);

export const tagSuggestionsFetchStart = createAction(
  RadioBrowserActions.TagSuggestionsFetchStart
);

export const tagSuggestionsFetchSucceeded = createAction(
  RadioBrowserActions.TagSuggestionsFetchSucceeded,
  props<{ tagSuggestions: string[] }>()
);

export const tagSuggestionsFetchFailed = createAction(
  RadioBrowserActions.TagSuggestionsFetchFailed,
  props<{ error: any }>()
);
