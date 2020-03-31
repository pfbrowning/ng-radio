import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RadioBrowserState } from '../models/radio-browser-state';
import { radioBrowserFeatureKey } from './radio-browser.reducer';

export const selectRadioBrowserState = createFeatureSelector<RadioBrowserState>(radioBrowserFeatureKey);

export const selectNameTerm = createSelector(
  selectRadioBrowserState,
  (state) => state.nameTerm
);

export const selectTagTerm = createSelector(
  selectRadioBrowserState,
  (state) => state.tagTerm
);

export const selectSearchCriteria = createSelector(
  selectNameTerm,
  selectTagTerm,
  (nameTerm, tagTerm) => ({nameTerm, tagTerm})
);

export const selectSearchResults = createSelector(
  selectRadioBrowserState,
  (state) => state.results
);

export const selectIsSearchInProgress = createSelector(
  selectRadioBrowserState,
  (state) => state.searchInProgress
);
