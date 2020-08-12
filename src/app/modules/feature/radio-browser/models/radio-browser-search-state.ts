
import { Country } from '@core/models';

export interface RadioBrowserSearchState {
    nameTerm: string;
    tagTerm: string;
    country: string;
    searchInProgress: boolean;
    countryFilter: string;
    countries: Country[];
    countriesFetchInProgress: boolean;
    countriesFetchFailed: boolean;
    tagSuggestions: string[];
    tagSuggestionsFetchInProgress: boolean;
}
