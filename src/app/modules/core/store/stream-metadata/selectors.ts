import { createSelector } from '@ngrx/store';
import { RootState } from '../../models/root-state';
import { MetadataViewModel } from '../../models/stream-metadata/metadata-view-model';

export const streamMetadataState = (state: RootState) => state.streamMetadata;

/* TODO We'll need a selector which selects all of the URLs that we want to listen for metatadata for across all
stores and features.  This will probably involve starting with an empty array, including the current station if there
is one, and then adding the urls from favorites or search conditionally based on the current route url. */

export const streamsMap = createSelector(
    streamMetadataState,
    (state) => new Map<string, MetadataViewModel>(Object.keys(state.streams).map(url => [
        url, {
            title: state.streams[url],
            connecting: state.connectionInProgressStreams.includes(url)
        }
    ]))
);

