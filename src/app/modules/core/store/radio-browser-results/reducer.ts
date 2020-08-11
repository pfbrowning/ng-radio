import { Action, createReducer, on } from '@ngrx/store';
import { RadioBrowserResultsState } from './models/radio-browser-results-state';
import { initialRadioBrowserResultsState } from './models/initial-radio-browser-results-state';
import * as RadioBrowserResultsActions from './actions';

export const radioBrowserResultsReducer = createReducer<RadioBrowserResultsState>(
    initialRadioBrowserResultsState,
    on(RadioBrowserResultsActions.searchSucceeded, (state, { results }) => ({
        ...state,
        results
    })),
);