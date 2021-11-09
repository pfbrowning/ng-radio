import { Station } from '@core/models/player';

export interface SuggestedStationsState {
  developerSuggested: Station[];
  developerSuggestedFetchInProgress: boolean;
  developerSuggestedFetchFailed: boolean;
  topClicked: Station[];
  topClickedFetchInProgress: boolean;
  topClickedFetchFailed: boolean;
  topVoted: Station[];
  topVotedFetchInProgress: boolean;
  topVotedFetchFailed: boolean;
}
