import { createSelector } from '@ngrx/store';
import { RootState } from '../../../models/root-state';
import { MetadataViewModel } from '../../../models/stream-metadata/metadata-view-model';

export const streamMetadataState = (state: RootState) => state.streamMetadata;

export const streamViewModels = createSelector(
    streamMetadataState,
    (state) => Object.keys(state.streams).map(url => ({
        url,
        title: state.streams[url],
        connecting: state.connectionInProgressStreams.includes(url)
    }))
)