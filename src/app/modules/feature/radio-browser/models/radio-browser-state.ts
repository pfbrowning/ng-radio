import { Station } from '@core/models/player';
import { Country } from '@core/models';

export interface RadioBrowserState {
    nameTerm: string;
    tagTerm: string;
    country: string;
    searchInProgress: boolean;
    results: Station[];
    countries: Country[];
    countriesFetchInProgress: boolean;
    countriesFetchFailed: boolean;
    tagSuggestions: string[];
    tagSuggestionsFetchInProgress: boolean;
}
