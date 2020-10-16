import { SuggestedStationsState } from './suggested-stations-state';

export const initialSuggestedStationsState: SuggestedStationsState = {
    developerSuggested: null,
    developerSuggestedFetchInProgress: false,
    developerSuggestedFetchFailed: false,
    topClicked: null,
    topClickedFetchInProgress: false,
    topClickedFetchFailed: false,
    topVoted: null,
    topVotedFetchInProgress: false,
    topVotedFetchFailed: false,
};
