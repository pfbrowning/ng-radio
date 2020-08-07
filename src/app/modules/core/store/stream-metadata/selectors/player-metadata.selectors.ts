import { createSelector } from '@ngrx/store';
import { MetadataViewModel } from '../../../models/stream-metadata/metadata-view-model';
import * as PlayerSelectors from '../../player/player.selectors';
import * as MetadataSelectors from './selectors';

export const streamViewModelsMappedToValidatedStreams = createSelector(
    MetadataSelectors.streamViewModels,
    PlayerSelectors.streamsMappedToADifferentUrl,
    (viewModels, mapped) => viewModels.reduce((prev, current) => {
        /* If we have the metadata for a validated stream and the original
        stream is different (such as for a looked-up pls), then add an extra
        copy of the metadata for the original stream so that we can find it
        in our grids. */
        const next = prev.concat(current);
        const match = mapped.find(m => m.validated === current.url);
        if (match) {
            next.push({
                ...current,
                url: match.original
            });
        }
        return next;
    }, []) as Array<MetadataViewModel>
);

export const streamsMap = createSelector(
    streamViewModelsMappedToValidatedStreams,
    viewModels => new Map<string, MetadataViewModel>(viewModels.map(vm => [vm.url, vm]))
)

export const metadataForCurrentStation = createSelector(
    PlayerSelectors.selectCurrentStation,
    streamsMap,
    (current, streams) => streams.get(current.url)
)