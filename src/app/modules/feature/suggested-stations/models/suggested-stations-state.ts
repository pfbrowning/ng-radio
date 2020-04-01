import { Station } from '@core/models/player';

export interface SuggestedStationsState {
    developerSuggested: Array<Station>;
    developerSuggestedFetchInProgress: boolean;
    developerSuggestedFetchFailed: boolean;
    topClicked: Array<Station>;
    topClickedFetchInProgress: boolean;
    topClickedFetchFailed: boolean;
    topVoted: Array<Station>;
    topVotedFetchInProgress: boolean;
    topVotedFetchFailed: boolean;
}
