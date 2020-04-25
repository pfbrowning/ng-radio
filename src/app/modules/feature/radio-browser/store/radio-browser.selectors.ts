import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RadioBrowserState } from '../models/radio-browser-state';
import { radioBrowserFeatureKey } from './radio-browser.reducer';

export const selectRadioBrowserState = createFeatureSelector<RadioBrowserState>(radioBrowserFeatureKey);

export const searchCriteria = createSelector(
  selectRadioBrowserState,
  state => ({
    nameTerm: state.nameTerm,
    tagTerm: state.tagTerm,
    country: state.country
  })
);

export const selectSearchResults = createSelector(
  selectRadioBrowserState,
  (state) => state.results
);

export const selectIsSearchInProgress = createSelector(
  selectRadioBrowserState,
  (state) => state.searchInProgress
);

export const listedCountries = createSelector(
  selectRadioBrowserState,
  (state) => state.countries
);

export const resolverParams = createSelector(
  selectRadioBrowserState,
  listedCountries,
  (state, countries) => ({
    countries,
    fetching: state.countriesFetchInProgress,
    failed: state.countriesFetchFailed
  })
);
