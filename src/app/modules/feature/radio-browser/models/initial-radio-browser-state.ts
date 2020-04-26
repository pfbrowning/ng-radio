import { RadioBrowserState } from './radio-browser-state';

export const initialRadioBrowserState: RadioBrowserState = {
    nameTerm: null,
    tagTerm: null,
    country: null,
    searchInProgress: false,
    results: null,
    countryFilter: null,
    countries: null,
    countriesFetchInProgress: false,
    countriesFetchFailed: false,
    tagSuggestions: null,
    tagSuggestionsFetchInProgress: false
};
