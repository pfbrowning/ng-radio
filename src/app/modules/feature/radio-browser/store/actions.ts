import { createAction, props } from '@ngrx/store';
import { Country } from '@core/models';

export enum RadioBrowserSearchActions {
  RouteResolverInit = '[Radio Browser Search Route Resolver] Resolve Init',
  NameTermChanged = '[Radio Browser Search Page] Name Term Changed',
  TagTermChanged = '[Radio Browser Search Page] Tag Term Changed',
  CountryFilterChanged = '[Radio Browser Search Page] Country Filter Changed',
  CountrySelected = '[Radio Browser Search Page] Country Selected',
  SearchStart = '[Radio Browser API] Search Start',
  SearchFailed = '[Radio Browser API] Search Failed',
  CountriesFetchStart = '[Radio Browser API] Countries Fetch Start',
  CountriesFetchSucceeded = '[Radio Browser API] Countries Fetch Succeeded',
  CountriesFetchFailed = '[Radio Browser API] Countries Fetch Failed',
  TagInputFocused = '[Radio Browser Search Page] Tag Input Focused',
  TagSuggestionsFetchStart = '[Radio Browser API] Tag Suggestions Fetch Start',
  TagSuggestionsFetchSucceeded = '[Radio Browser API] Tag Suggestions Fetch Succeeded',
  TagSuggestionsFetchFailed = '[Radio Browser API] Tag Suggestions Fetch Failed',
}

export const resolveSubmit = createAction(
  RadioBrowserSearchActions.RouteResolverInit
);

export const nameTermChanged = createAction(
  RadioBrowserSearchActions.NameTermChanged,
  props<{ term: string }>()
);

export const tagTermChanged = createAction(
  RadioBrowserSearchActions.TagTermChanged,
  props<{ term: string }>()
);

export const countrySelected = createAction(
  RadioBrowserSearchActions.CountrySelected,
  props<{ country: string }>()
);

export const searchStart = createAction(
  RadioBrowserSearchActions.SearchStart
);

export const searchFailed = createAction(
  RadioBrowserSearchActions.SearchFailed,
  props<{ error: any }>()
);

export const countryFilterChanged = createAction(
  RadioBrowserSearchActions.CountryFilterChanged,
  props<{ text: string }>()
);

export const countriesFetchStart = createAction(
  RadioBrowserSearchActions.CountriesFetchStart
);

export const countriesFetchSucceeded = createAction(
  RadioBrowserSearchActions.CountriesFetchSucceeded,
  props<{ countries: Country[] }>()
);

export const countriesFetchFailed = createAction(
  RadioBrowserSearchActions.CountriesFetchFailed,
  props<{ error: any }>()
);

export const tagInputFocused = createAction(
  RadioBrowserSearchActions.TagInputFocused
);

export const tagSuggestionsFetchStart = createAction(
  RadioBrowserSearchActions.TagSuggestionsFetchStart
);

export const tagSuggestionsFetchSucceeded = createAction(
  RadioBrowserSearchActions.TagSuggestionsFetchSucceeded,
  props<{ tagSuggestions: string[] }>()
);

export const tagSuggestionsFetchFailed = createAction(
  RadioBrowserSearchActions.TagSuggestionsFetchFailed,
  props<{ error: any }>()
);
