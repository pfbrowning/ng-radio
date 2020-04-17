import { Station } from '@core/models/player';

export interface RadioBrowserState {
    nameTerm: string;
    tagTerm: string;
    searchInProgress: boolean;
    results: Station[];
}
