import { RadioBrowserSearchState } from './radio-browser-search-state';

export const initialRadioBrowserSearchState: RadioBrowserSearchState = {
  nameTerm: null,
  tagTerm: null,
  country: null,
  searchInProgress: false,
  countryFilter: null,
  countries: null,
  countriesFetchInProgress: false,
  countriesFetchFailed: false,
  tagSuggestions: null,
  tagSuggestionsFetchInProgress: false,
};
