import { createSelector } from '@ngrx/store';
import { RootState } from '../../../models/root-state';

export const streamMetadataState = (state: RootState) => state.streamMetadata;

export const streamViewModels = createSelector(streamMetadataState, state =>
  Object.keys(state.streams).map(url => ({
    url,
    title: state.streams[url],
  }))
);
