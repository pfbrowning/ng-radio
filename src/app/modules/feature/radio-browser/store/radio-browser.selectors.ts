import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RadioBrowserState } from '../models/radio-browser-state';
import { radioBrowserFeatureKey } from './radio-browser.reducer';
import isBlank from 'is-blank';

export const selectRadioBrowserState = createFeatureSelector<RadioBrowserState>(radioBrowserFeatureKey);

export const selectedCountry = createSelector(
  selectRadioBrowserState,
  state => state.country
);

export const searchCriteria = createSelector(
  selectRadioBrowserState,
  selectedCountry,
  (state, country) => ({
    nameTerm: state.nameTerm,
    tagTerm: state.tagTerm,
    country
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

export const countryFilter = createSelector(
  selectRadioBrowserState,
  state => state.countryFilter
);

export const filteredCountries = createSelector(
  countryFilter,
  listedCountries,
  (filter, countries) => isBlank(filter) ? countries : countries.filter(c => c.name.toLowerCase().includes(filter.toLowerCase()))
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

export const tagSuggestions = createSelector(
  selectRadioBrowserState,
  (state) => state.tagSuggestions
);

export const fetchingTagSuggestions = createSelector(
  selectRadioBrowserState,
  (state) => state.tagSuggestionsFetchInProgress
);
