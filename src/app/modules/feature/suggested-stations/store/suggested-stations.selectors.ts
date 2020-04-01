import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SuggestedStationsState } from '../models/suggested-stations-state';
import { suggestedStationsFeatureKey } from './suggested-stations.reducer';

export const selectSuggestedStationsState = createFeatureSelector<SuggestedStationsState>(suggestedStationsFeatureKey);

export const selectDeveloperSuggested = createSelector(
  selectSuggestedStationsState,
  (state) => state.developerSuggested
);

export const selectTopClicked = createSelector(
  selectSuggestedStationsState,
  (state) => state.topClicked
);

export const selectTopVoted = createSelector(
  selectSuggestedStationsState,
  (state) => state.topVoted
);

export const selectAreSuggestedStationsPresentOrFailed = createSelector(
  selectDeveloperSuggested,
  selectTopClicked,
  selectTopVoted,
  selectSuggestedStationsState,
  (devSuggested, topClicked, topVoted, state) =>
    (devSuggested != null || state.developerSuggestedFetchFailed) &&
    (topClicked != null || state.topClickedFetchFailed) &&
    (topVoted != null || state.topVotedFetchFailed)
);
