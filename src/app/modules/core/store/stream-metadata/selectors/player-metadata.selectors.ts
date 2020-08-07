import { createSelector } from '@ngrx/store';
import * as PlayerSelectors from '../../player/player.selectors';
import * as MetadataSelectors from './selectors';

export const metadataForCurrentStation = createSelector(
    PlayerSelectors.selectCurrentStation,
    MetadataSelectors.streamsMap,
    (current, streams) => streams.get(current.url)
)