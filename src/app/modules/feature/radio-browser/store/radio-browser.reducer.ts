import { Action, createReducer, on } from '@ngrx/store';
import { RadioBrowserState } from '../models/radio-browser-state';
import { initialRadioBrowserState } from '../models/initial-radio-browser-state';
import * as RadioBrowserActions from './radio-browser.actions';

export const radioBrowserFeatureKey = 'radioBrowser';

const reducer = createReducer<RadioBrowserState>(
  initialRadioBrowserState,
  on(RadioBrowserActions.nameTermUpdated, (state, {term}) => ({
    ...state,
    nameTerm: term
  })),
  on(RadioBrowserActions.tagTermUpdated, (state, {term}) => ({
    ...state,
    tagTerm: term
  })),
  on(RadioBrowserActions.countrySelected, (state, {country}) => ({
    ...state,
    country
  })),
  on(RadioBrowserActions.searchStart, state => ({
    ...state,
    searchInProgress: true
  })),
  on(RadioBrowserActions.searchSucceeded, (state, { results }) => ({
    ...state,
    searchInProgress: false,
    results
  })),
  on(RadioBrowserActions.searchFailed, state => ({
    ...state,
    searchInProgress: false
  })),
  on(RadioBrowserActions.resolveSubmit, state => ({
    ...state,
    countriesFetchFailed: false
  })),
  on(RadioBrowserActions.countriesFetchStart, state => ({
    ...state,
    countriesFetchInProgress: true,
    countriesFetchFailed: false
  })),
  on(RadioBrowserActions.countriesFetchFailed, state => ({
    ...state,
    countriesFetchInProgress: false,
    countriesFetchFailed: true
  })),
  on(RadioBrowserActions.countriesFetchSucceeded, (state, { countries }) => ({
    ...state,
    countriesFetchInProgress: false,
    countriesFetchFailed: false,
    countries
  })),
);

export function radioBrowserReducer(state: RadioBrowserState | undefined, action: Action) {
  return reducer(state, action);
}
