import { createSelector } from '@ngrx/store';
import { RootState } from '../../models/root-state';

export const radioBrowserResultsState = (state: RootState) => state.radioBrowserResults;

export const radioBrowserResults = createSelector(
    radioBrowserResultsState,
    (state) => state.results
);
