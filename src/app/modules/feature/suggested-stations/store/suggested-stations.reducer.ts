import { createReducer, on } from '@ngrx/store';
import { initialSuggestedStationsState } from '../models/initial-suggested-stations-state';
import * as SuggestedStationsActions from './suggested-stations.actions';

export const suggestedStationsFeatureKey = 'suggestedStations';

export const suggestedStationsReducer = createReducer(
  initialSuggestedStationsState,
  on(SuggestedStationsActions.developerSuggestedFetchStart, state => ({
    ...state,
    developerSuggestedFetchInProgress: true,
  })),
  on(SuggestedStationsActions.developerSuggestedFetchSucceeded, (state, { stations }) => ({
    ...state,
    developerSuggestedFetchInProgress: false,
    developerSuggested: stations,
  })),
  on(SuggestedStationsActions.developerSuggestedFetchFailed, state => ({
    ...state,
    developerSuggestedFetchInProgress: false,
    developerSuggestedFetchFailed: true,
  })),
  on(SuggestedStationsActions.topClickedFetchStart, state => ({
    ...state,
    topClickedFetchInProgress: true,
  })),
  on(SuggestedStationsActions.topClickedFetchSucceeded, (state, { stations }) => ({
    ...state,
    topClickedFetchInProgress: false,
    topClicked: stations,
  })),
  on(SuggestedStationsActions.topClickedFetchFailed, state => ({
    ...state,
    topClickedFetchInProgress: false,
    topClickedFetchFailed: true,
  })),
  on(SuggestedStationsActions.topVotedFetchStart, state => ({
    ...state,
    topVotedFetchInProgress: true,
  })),
  on(SuggestedStationsActions.topVotedFetchSucceeded, (state, { stations }) => ({
    ...state,
    topVotedFetchInProgress: false,
    topVoted: stations,
  })),
  on(SuggestedStationsActions.topVotedFetchFailed, state => ({
    ...state,
    topVotedFetchInProgress: false,
    topVotedFetchFailed: true,
  }))
);
