import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RadioBrowserSearchState } from '../models/radio-browser-search-state';
import { radioBrowserSearchFeatureKey } from './reducer';
import isFalsyOrWhitespace from 'is-falsy-or-whitespace';

export const radioBrowserSearchState = createFeatureSelector<
    RadioBrowserSearchState
>(radioBrowserSearchFeatureKey);

export const selectedCountry = createSelector(
    radioBrowserSearchState,
    state => state.country
);

export const searchCriteria = createSelector(
    radioBrowserSearchState,
    selectedCountry,
    (state, country) => ({
        nameTerm: state.nameTerm,
        tagTerm: state.tagTerm,
        country,
    })
);

export const selectIsSearchInProgress = createSelector(
    radioBrowserSearchState,
    state => state.searchInProgress
);

export const listedCountries = createSelector(
    radioBrowserSearchState,
    state => state.countries
);

export const countryFilter = createSelector(
    radioBrowserSearchState,
    state => state.countryFilter
);

export const filteredCountries = createSelector(
    countryFilter,
    listedCountries,
    (filter, countries) =>
        isFalsyOrWhitespace(filter)
            ? countries
            : countries.filter(c =>
                  c.name.toLowerCase().includes(filter.toLowerCase())
              )
);

export const resolverParams = createSelector(
    radioBrowserSearchState,
    listedCountries,
    (state, countries) => ({
        countries,
        fetching: state.countriesFetchInProgress,
        failed: state.countriesFetchFailed,
    })
);

export const tagSuggestions = createSelector(
    radioBrowserSearchState,
    state => state.tagSuggestions
);

export const fetchingTagSuggestions = createSelector(
    radioBrowserSearchState,
    state => state.tagSuggestionsFetchInProgress
);
