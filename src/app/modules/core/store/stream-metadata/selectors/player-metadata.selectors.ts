import { createSelector } from '@ngrx/store';
import { PlayerSelectors } from '../../player/selectors';
import * as MetadataSelectors from './selectors';

export const streamsMap = createSelector(
    MetadataSelectors.streamViewModels,
    viewModels =>
        new Map<string, string>(viewModels.map(vm => [vm.url, vm.title]))
);

export const metadataForCurrentStation = createSelector(
    PlayerSelectors.currentStation,
    streamsMap,
    (current, streams) => current && streams.get(current.url)
);
